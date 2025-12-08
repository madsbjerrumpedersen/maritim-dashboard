import type { Node } from "../data/maritimeGraph";
import type { ShipProfile } from "../data/ships";

export interface VoyagePoint {
  distanceKm: number;
  timeHours: number;
  speedKnots: number;
  co2Kg: number;
  windSpeed: number; // m/s
  windDir: number; // degrees
  isStop: boolean;
  stopName?: string;
}

export interface VoyageSummary {
  totalTimeHours: number;
  totalDistanceKm: number;
  totalCo2Kg: number;
  avgSpeedKnots: number;
  segments: VoyagePoint[];
}

interface WeatherSnapshot {
  windSpeed: number; // m/s
  windDir: number; // degrees
}

// Helpers
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
};

// Physics Simulation
export const calculateVoyageProfile = (
  nodes: Node[],
  ship: ShipProfile,
  weatherMap: Record<string, WeatherSnapshot> // Keyed by stop ID (or closest stop)
): VoyageSummary => {
  if (nodes.length < 2) {
    return {
      totalTimeHours: 0,
      totalDistanceKm: 0,
      totalCo2Kg: 0,
      avgSpeedKnots: 0,
      segments: []
    };
  }

  const segments: VoyagePoint[] = [];
  let totalDistNm = 0;
  let totalTimeHours = 0;
  let totalFuelKg = 0;
  
  // Initial point
  segments.push({
    distanceKm: 0,
    timeHours: 0,
    speedKnots: 0, // Speed 0 at dock
    co2Kg: 0,
    windSpeed: 0,
    windDir: 0,
    isStop: true,
    stopName: nodes[0].id
  });

  // Iterate route segments
  for (let i = 0; i < nodes.length - 1; i++) {
    const start = nodes[i];
    const end = nodes[i + 1];
    
    // 1. Calculate Geometry
    // Try to get precise distance from graph link, else standard Haversine
    const neighbor = start.neighbors.find(n => n.nodeId === end.id);
    const distNm = neighbor ? neighbor.distance : Math.sqrt(Math.pow(start.lat - end.lat, 2) + Math.pow(start.lng - end.lng, 2)) * 60;
    
    const bearing = calculateBearing(start.lat, start.lng, end.lat, end.lng);

    // 2. Determine Weather for this segment
    // Logic: Look up weather for the 'start' node. 
    // Ideally we interpolate between start/end weather, but nearest neighbor (start) is fine for V1.
    // If no weather found (e.g. intermediate waypoints without weather data), default to 5 m/s headwind as generic sea condition.
    // We assume 'weatherMap' keys match city IDs. If a node is not a city, we look back to last city.
    let weather = weatherMap[start.id];
    if (!weather) {
       // Find last known city
       for(let j=i; j>=0; j--) {
           if (nodes[j].isCity && weatherMap[nodes[j].id]) {
               weather = weatherMap[nodes[j].id];
               break;
           }
       }
    }
    // Default weather if completely missing
    if (!weather) weather = { windSpeed: 5, windDir: (bearing + 180) % 360 }; 

    // 3. Physics Calculation (Wind Impact)
    // Relative Wind Angle: 0 = Tailwind, 180 = Headwind
    // Wind Direction is "Coming From". 
    // If Ship goes 90 deg (East) and Wind is 90 deg (East wind, coming from East), that is Headwind.
    // Relative Angle = abs(WindDir - ShipHeading)
    // Ideally: cos(180) = -1 (Headwind), cos(0) = 1 (Tailwind)
    
    // We want the angle relative to the bow.
    // AngleOfAttack = WindDir - ShipHeading.
    // Cos(AngleOfAttack):
    // Wind 90, Ship 90 -> Angle 0 -> Cos(0)=1. This implies Tailwind? 
    // Wait. "Wind from East (90)" hitting "Ship going East (90)" is Headwind.
    // So 0 deg difference = Headwind. 180 deg difference = Tailwind.
    // Let's invert the logic factor.
    
    const relativeAngleRad = toRad(Math.abs(weather.windDir - bearing));
    const windFactor = Math.cos(relativeAngleRad); // 1 = Headwind (bad), -1 = Tailwind (good)
    
    // Impact: Headwind (1) slows down. Tailwind (-1) speeds up.
    // Formula: Impact = WindSpeed(knots) * Factor * ShipWindage
    // Note: WindSpeed input is m/s. 1 m/s ~= 2 knots.
    const windSpeedKnots = weather.windSpeed * 1.94;
    const speedPenalty = windSpeedKnots * windFactor * ship.windage;
    
    // Calculate Final Speed
    let actualSpeed = ship.cruiseSpeed - speedPenalty;
    
    // Clamp limits
    if (actualSpeed > ship.maxSpeed) actualSpeed = ship.maxSpeed;
    if (actualSpeed < 5) actualSpeed = 5; // Minimum viable speed (don't stop in bad weather)

    // 4. Time & Fuel
    const timeHours = distNm / actualSpeed;
    
    // Fuel Burn: 
    // Base burn * distance
    // Plus extra burn for fighting resistance? 
    // Simplified: Burn is constant per hour at cruise? Or per mile?
    // Let's model: Consumption increases with resistance.
    // Effective Distance = Distance * (1 + ResistanceFactor)
    // ResistanceFactor ~= windFactor * 0.1 (10% fuel penalty for full headwind)
    const resistanceFactor = Math.max(0, windFactor * 0.15); // Only headwind costs extra fuel
    const segmentFuel = (distNm * ship.fuelConsumptionAtCruise) * (1 + resistanceFactor);

    // Accumulate
    totalDistNm += distNm;
    totalTimeHours += timeHours;
    totalFuelKg += segmentFuel;

    // Add Segment Point (End of segment)
    segments.push({
      distanceKm: totalDistNm * 1.852,
      timeHours: totalTimeHours,
      speedKnots: Number(actualSpeed.toFixed(1)),
      co2Kg: totalFuelKg * ship.co2Factor, // Cumulative CO2
      windSpeed: weather.windSpeed,
      windDir: weather.windDir,
      isStop: end.isCity,
      stopName: end.isCity ? end.id : undefined
    });
  }

  return {
    totalTimeHours,
    totalDistanceKm: totalDistNm * 1.852,
    totalCo2Kg: totalFuelKg * ship.co2Factor,
    avgSpeedKnots: totalDistNm / totalTimeHours,
    segments
  };
};
