import type { Node } from "../data/maritimeGraph";
import type { ShipProfile } from "../data/ships";
import type { RouteForecast, HourlyWeather } from "../data/weatherService";

export interface VoyagePoint {
  distanceKm: number;
  timeHours: number;
  speedKnots: number;
  co2Kg: number;
  windSpeed: number; // m/s
  windDir: number; // degrees
  isStop: boolean;
  stopName?: string;
  segmentBearing: number;
  speedPenalty: number;
}

export interface VoyageSummary {
  totalTimeHours: number;
  totalDistanceKm: number;
  totalCo2Kg: number;
  avgSpeedKnots: number;
  segments: VoyagePoint[];
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

// Helper function to get weather for a given time and node
const getWeatherForTimeAndNode = (
    targetTimeMs: number, // Unix timestamp in ms
    startNode: Node, // The node we're currently at
    allNodesInRoute: Node[], // All nodes in the route, for finding closest city if startNode has no forecast
    weatherMap: RouteForecast, // All weather forecasts
    fallbackBearing: number // For default weather if no forecast at all
): { windSpeed: number; windDir: number } => {

    let forecast: HourlyWeather[] | undefined = weatherMap[startNode.id];
    
    // If no direct forecast for this node, try to find for an upstream city
    // This is a simplified search to find *any* relevant forecast.
    if (!forecast || forecast.length === 0) {
        // Iterate backwards from startNode's position in allNodesInRoute to find a city with forecast
        const startIndex = allNodesInRoute.findIndex(n => n.id === startNode.id);
        for(let i = startIndex; i >= 0; i--) {
            if (allNodesInRoute[i].isCity && weatherMap[allNodesInRoute[i].id] && weatherMap[allNodesInRoute[i].id].length > 0) {
                forecast = weatherMap[allNodesInRoute[i].id];
                break;
            }
        }
    }

    if (forecast && forecast.length > 0) {
        const nearest = forecast.reduce((prev, curr) => 
            Math.abs(curr.time - targetTimeMs) < Math.abs(prev.time - targetTimeMs) ? curr : prev
        );
        return { windSpeed: nearest.windSpeed, windDir: nearest.windDir };
    } else {
        // Default weather if completely missing
        return { windSpeed: 5, windDir: (fallbackBearing + 180) % 360 }; 
    }
};

// Physics Simulation
export const calculateVoyageProfile = (
  nodes: Node[],
  ship: ShipProfile,
  weatherMap: RouteForecast, // Keyed by stop ID (or closest stop)
  startTime: number = Date.now()
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
  
  // Get initial weather for the start point
  const initialWeather = getWeatherForTimeAndNode(startTime, nodes[0], nodes, weatherMap, 0); // bearing 0 is placeholder for initial point

  // Initial point
  segments.push({
    distanceKm: 0,
    timeHours: 0,
    speedKnots: ship.cruiseSpeed, // Start at cruise speed (simplification for graph visuals)
    co2Kg: 0,
    windSpeed: initialWeather.windSpeed,
    windDir: initialWeather.windDir,
    isStop: true,
    stopName: nodes[0].id,
    segmentBearing: 0,
    speedPenalty: 0
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

    // 2. Determine Weather for this segment at CURRENT TRIP TIME
    const currentTripTime = startTime + (totalTimeHours * 3600 * 1000);
    const weather = getWeatherForTimeAndNode(currentTripTime, end, nodes, weatherMap, bearing); // Use 'end' node for weather lookup of the segment

    // 3. Physics Calculation (Wind Impact)
    const relativeAngleRad = toRad(Math.abs(weather.windDir - bearing));
    const windFactor = Math.cos(relativeAngleRad); // 1 = Headwind (bad), -1 = Tailwind (good)
    
    const windSpeedKnots = weather.windSpeed * 1.94;
    const speedPenalty = windSpeedKnots * windFactor * ship.windage;
    
    let actualSpeed = ship.cruiseSpeed - speedPenalty;
    
    // Clamp limits
    if (actualSpeed > ship.maxSpeed) actualSpeed = ship.maxSpeed;
    if (actualSpeed < 5) actualSpeed = 5; // Minimum viable speed (don't stop in bad weather)

    // 4. Time & Fuel
    const timeHours = distNm / actualSpeed;
    
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
      stopName: end.isCity ? end.id : undefined,
      segmentBearing: bearing,
      speedPenalty: Number(speedPenalty.toFixed(1))
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
