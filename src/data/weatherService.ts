import type { Node } from "./maritimeGraph";

export interface HourlyWeather {
  time: number; // Unix timestamp (ms)
  windSpeed: number; // m/s
  windDir: number; // degrees
}

export type RouteForecast = Record<string, HourlyWeather[]>;

export const fetchRouteWeather = async (nodes: Node[]): Promise<RouteForecast> => {
  const weatherMap: RouteForecast = {};
  
  // Filter for unique cities or stops to avoid duplicate requests
  const stops = nodes.filter(n => n.isCity);
  const uniqueStops = Array.from(new Set(stops.map(s => s.id)))
    .map(id => stops.find(s => s.id === id)!);

  // Limit to avoid spamming the API if route is huge (e.g. max 10 stops)
  const stopsToFetch = uniqueStops.slice(0, 10);

  const requests = stopsToFetch.map(async (stop) => {
    try {
      // Fetch hourly forecast for 14 days (long voyages)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${stop.lat}&longitude=${stop.lng}&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&forecast_days=14`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.hourly) {
        const hourlyData: HourlyWeather[] = data.hourly.time.map((t: string, index: number) => ({
          time: new Date(t).getTime(),
          windSpeed: data.hourly.wind_speed_10m[index],
          windDir: data.hourly.wind_direction_10m[index]
        }));
        
        weatherMap[stop.id] = hourlyData;
      }
    } catch (error) {
      console.warn(`Failed to fetch weather for ${stop.id}`, error);
    }
  });

  await Promise.all(requests);
  return weatherMap;
};
