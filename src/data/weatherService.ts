import type { Node } from "./maritimeGraph";

export interface RouteWeatherData {
  windSpeed: number; // m/s
  windDir: number; // degrees
}

export const fetchRouteWeather = async (nodes: Node[]): Promise<Record<string, RouteWeatherData>> => {
  const weatherMap: Record<string, RouteWeatherData> = {};
  
  // Filter for unique cities or stops to avoid duplicate requests
  const stops = nodes.filter(n => n.isCity);
  const uniqueStops = Array.from(new Set(stops.map(s => s.id)))
    .map(id => stops.find(s => s.id === id)!);

  // Limit to avoid spamming the API if route is huge (e.g. max 10 stops)
  const stopsToFetch = uniqueStops.slice(0, 10);

  const requests = stopsToFetch.map(async (stop) => {
    try {
      // Fetch current weather only
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${stop.lat}&longitude=${stop.lng}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.current) {
        weatherMap[stop.id] = {
          windSpeed: data.current.wind_speed_10m,
          windDir: data.current.wind_direction_10m
        };
      }
    } catch (error) {
      console.warn(`Failed to fetch weather for ${stop.id}`, error);
    }
  });

  await Promise.all(requests);
  return weatherMap;
};
