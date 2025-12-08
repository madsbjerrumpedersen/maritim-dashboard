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
  windFactor: number; // -1 (Tail) to 1 (Head)
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
    currentNode: Node, // The node we're currently at
    allNodesInRoute: Node[], // All nodes in the route
    weatherMap: RouteForecast, // All weather forecasts
    fallbackBearing: number // For default weather if no forecast at all
): { windSpeed: number; windDir: number } => {

    const currentIndex = allNodesInRoute.findIndex(n => n.id === currentNode.id);
    if (currentIndex === -1) return { windSpeed: 5, windDir: (fallbackBearing + 180) % 360 };

    // 1. Find Previous City with Forecast
    let prevCityNode: Node | null = null;
    let prevCityIndex = -1;
    for (let i = currentIndex; i >= 0; i--) {
        if (allNodesInRoute[i].isCity && weatherMap[allNodesInRoute[i].id]) {
            prevCityNode = allNodesInRoute[i];
            prevCityIndex = i;
            break;
        }
    }

    // 2. Find Next City with Forecast
    let nextCityNode: Node | null = null;
    let nextCityIndex = -1;
    for (let i = currentIndex + 1; i < allNodesInRoute.length; i++) {
        if (allNodesInRoute[i].isCity && weatherMap[allNodesInRoute[i].id]) {
            nextCityNode = allNodesInRoute[i];
            nextCityIndex = i;
            break;
        }
    }

    // Helper to get forecast at specific time from a forecast array
    const getForecastAtTime = (forecast: HourlyWeather[]): { windSpeed: number, windDir: number } => {
        if (!forecast || forecast.length === 0) return { windSpeed: 5, windDir: 0 };
        
        const startTime = forecast[0].time;
        const endTime = forecast[forecast.length - 1].time;
        const duration = endTime - startTime;
        
        let lookupTime = targetTimeMs;

        // If target time is beyond the forecast range, loop/cycle the weather pattern
        // This ensures we don't just hit a static "last known weather" for long trips.
        if (lookupTime > endTime && duration > 0) {
            lookupTime = startTime + ((lookupTime - startTime) % duration);
        }

        return forecast.reduce((prev, curr) => 
            Math.abs(curr.time - lookupTime) < Math.abs(prev.time - lookupTime) ? curr : prev
        );
    };

    // Case A: No weather data found at all
    if (!prevCityNode && !nextCityNode) {
        return { windSpeed: 5, windDir: (fallbackBearing + 180) % 360 };
    }

    // Case B: Only Previous City Found (or we are at the end)
    if (prevCityNode && !nextCityNode) {
        return getForecastAtTime(weatherMap[prevCityNode.id]);
    }

    // Case C: Only Next City Found (start of route before first city?)
    if (!prevCityNode && nextCityNode) {
        return getForecastAtTime(weatherMap[nextCityNode.id]);
    }

    // Case D: Interpolate between Prev and Next
    if (prevCityNode && nextCityNode) {
        const weatherStart = getForecastAtTime(weatherMap[prevCityNode.id]);
        const weatherEnd = getForecastAtTime(weatherMap[nextCityNode.id]);

        // Calculate distances for interpolation
        // We need distance from PrevCity to CurrentNode, and PrevCity to NextCity
        // Since we don't have cumulative distance easily available here without re-calculating, 
        // we can use the node indices as a rough proxy for progress if the nodes are evenly spaced.
        // BUT, nodes are not evenly spaced. 
        // Better: Calculate simplified distance summation for the segment.
        
        const calcDist = (n1: Node, n2: Node) => {
             const neighbor = n1.neighbors.find(n => n.nodeId === n2.id);
             return neighbor ? neighbor.distance : Math.sqrt(Math.pow(n1.lat - n2.lat, 2) + Math.pow(n1.lng - n2.lng, 2)) * 60 * 1.852; // km
        };

        let distPrevToCurrent = 0;
        for (let i = prevCityIndex; i < currentIndex; i++) {
            distPrevToCurrent += calcDist(allNodesInRoute[i], allNodesInRoute[i+1]);
        }

        let distCurrentToNext = 0;
        for (let i = currentIndex; i < nextCityIndex; i++) {
            distCurrentToNext += calcDist(allNodesInRoute[i], allNodesInRoute[i+1]);
        }

        const totalSegmentDist = distPrevToCurrent + distCurrentToNext;
        const ratio = totalSegmentDist > 0 ? distPrevToCurrent / totalSegmentDist : 0;

        // Linear Interpolation
        const windSpeed = weatherStart.windSpeed + (weatherEnd.windSpeed - weatherStart.windSpeed) * ratio;
        
        // Angular Interpolation for Wind Dir (Shortest path)
        let diff = weatherEnd.windDir - weatherStart.windDir;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        let windDir = weatherStart.windDir + diff * ratio;
        if (windDir < 0) windDir += 360;
        if (windDir >= 360) windDir -= 360;

        return { windSpeed, windDir };
    }

    return { windSpeed: 5, windDir: (fallbackBearing + 180) % 360 };
};

// Physics Simulation
export const calculateVoyageProfile = (
  nodes: Node[],
  ship: ShipProfile,
  weatherMap: RouteForecast, // Keyed by stop ID (or closest stop)
  startTime: number = Date.now(),
  optimizationPreference: number = 0 // 0 = Standard/Fast, 1 = Max Efficiency
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
    speedPenalty: 0,
    windFactor: 0
  });

  // Base consumption rate at cruise speed (kg/hour)
  // fuelConsumptionAtCruise is kg/nm. 
  // Rate (kg/h) = kg/nm * nm/h = kg/nm * cruiseSpeed
  const baseKgPerHour = ship.fuelConsumptionAtCruise * ship.cruiseSpeed;
  
  // Physics Model Refinement: Hotel Load vs Propulsion
  // Not all fuel scales with speed^3. Hotel load (lighting, HVAC, crew) is constant.
  const HOTEL_LOAD_RATIO = 0.2; // 20% constant load
  const baseHotelRate = baseKgPerHour * HOTEL_LOAD_RATIO;
  const basePropulsionRate = baseKgPerHour * (1 - HOTEL_LOAD_RATIO);

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
    
    // Calculate Optimized Target Speed
    // Strategy: If optimizationPreference is high, we drop speed.
    // If Headwind (windFactor > 0) AND optimization is high, we drop speed MORE to avoid fighting resistance.
    
    const ecoSpeed = ship.cruiseSpeed * 0.7; // 70% speed is roughly half fuel? (0.7^3 = 0.34)
    // Interpolate base target based on preference
    let targetSpeed = ship.cruiseSpeed - (ship.cruiseSpeed - ecoSpeed) * optimizationPreference;
    
    // Dynamic adjustment for wind (Optimization logic)
    if (optimizationPreference > 0 && windFactor > 0.2) {
        // In headwind, slow down further
        // Max slowdown additional 15% at full preference and full headwind
        const slowdown = 0.15 * optimizationPreference * windFactor;
        targetSpeed = targetSpeed * (1 - slowdown);
    }

    const windSpeedKnots = weather.windSpeed * 1.94;
    const speedPenalty = windSpeedKnots * windFactor * ship.windage;
    
    let actualSpeed = targetSpeed - speedPenalty;
    
    // Clamp limits
    if (actualSpeed > ship.maxSpeed) actualSpeed = ship.maxSpeed;
    if (actualSpeed < 5) actualSpeed = 5; // Minimum viable speed (don't stop in bad weather)

    // 4. Time & Fuel
    const timeHours = distNm / actualSpeed;
    
    const resistanceFactor = Math.max(0, windFactor * 0.15); // Only headwind costs extra fuel
    
    // Updated Fuel Model: Cubic relation to speed with constant Hotel Load
    // Current Rate = (PropulsionBase * Ratio^3) + HotelBase
    const speedRatio = actualSpeed / ship.cruiseSpeed;
    const currentKgPerHour = (basePropulsionRate * Math.pow(speedRatio, 3)) + baseHotelRate;
    
    // Apply resistance factor to the BURN RATE (fighting wind needs more power for same speed)
    // Actually, physics: Power ~ Speed^3 + Resistance.
    // We already reduced speed due to penalty.
    // The engine is working to maintain 'actualSpeed'.
    // If we are fighting headwind, we are working harder than just for calm water at 'actualSpeed'.
    // Simple model: Rate * (1 + resistance)
    
    const segmentFuel = (currentKgPerHour * timeHours) * (1 + resistanceFactor);

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
      speedPenalty: Number(speedPenalty.toFixed(1)),
      windFactor
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
