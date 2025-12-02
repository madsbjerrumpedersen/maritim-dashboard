import { portCoordinates } from "./ports";

type Route = [number, number][];

// Predefined detailed maritime routes
const routes: { [key: string]: Route } = {
  // Rotterdam → Hamburg (example)
  "Rotterdam-Hamburg": [
    portCoordinates["Rotterdam"],
    [53.0, 5.0],
    portCoordinates["Hamburg"],
  ],

  // Copenhagen → Oslo
  "Copenhagen-Oslo": [
    portCoordinates["Copenhagen"],
    [56.3, 12.5], // Kattegat waypoint
    [57.5, 10.6], // Skagerrak midpoint
    [58.9, 10.0], // Approach to Oslofjord
    portCoordinates["Oslo"],
  ],

  // Copenhagen → Stockholm
  "Copenhagen-Stockholm": [
    portCoordinates["Copenhagen"],
    [55.9, 13.3], // Øresund exit
    [56.5, 15.5], // Baltic Sea south
    [57.7, 17.6], // Baltic central
    [58.7, 18.9], // Stockholm archipelago entry
    portCoordinates["Stockholm"],
  ],

  // Hamburg → London
  "Hamburg-London": [
    portCoordinates["Hamburg"],
    [54.0, 7.5], // German Bight
    [53.0, 3.5], // North Sea transit 1
    [52.5, 2.0], // North Sea transit 2
    [51.8, 1.2], // Thames Estuary
    portCoordinates["London"],
  ],

  // Rotterdam → New York
  "Rotterdam-New York": [
    portCoordinates["Rotterdam"],
    [52.5, -2.0], // Leaving North Sea
    [51.0, -10.0], // Mid-Atlantic waypoint 1
    [48.0, -30.0], // Mid-Atlantic waypoint 2
    [44.0, -50.0], // Western Atlantic
    [41.0, -68.0], // Approaching US coast
    portCoordinates["New York"],
  ],

  // Singapore → Shanghai
  "Singapore-Shanghai": [
    portCoordinates["Singapore"],
    [3.5, 104.0], // Singapore Strait
    [6.0, 106.0], // South China Sea south
    [12.0, 112.0], // South China Sea mid
    [18.0, 117.0], // South China Sea north
    [24.0, 121.0], // East China Sea south
    portCoordinates["Shanghai"],
  ],

  // Tokyo → Los Angeles
  "Tokyo-Los Angeles": [
    portCoordinates["Tokyo"],
    [36.0, 150.0],
    [40.0, 170.0],
    [42.0, 190.0], // Crossing International Date Line
    [38.0, 215.0],
    [34.0, 232.0],
    portCoordinates["Los Angeles"],
  ],

  // Sydney → Singapore
  "Sydney-Singapore": [
    portCoordinates["Sydney"],
    [-28.0, 155.0], // Leaving east Australia
    [-15.0, 150.0], // Coral Sea
    [-5.0, 142.0], // Papua region
    [0.5, 130.0], // Banda Sea
    [2.0, 112.0], // Java Sea
    portCoordinates["Singapore"],
  ],
};

// Reverse routes automatically
const reverseRoute = (route: Route): Route => [...route].reverse();
const reversedRoutes: { [key: string]: Route } = {};
for (const key in routes) {
  const [start, end] = key.split('-');
  reversedRoutes[`${end}-${start}`] = reverseRoute(routes[key]);
}

export const allRoutes = { ...routes, ...reversedRoutes };

export const getSeaRoute = (start: string, destination: string): Route | null => {
  const key = `${start}-${destination}`;

  if (allRoutes[key]) {
    return allRoutes[key];
  }

  if (portCoordinates[start] && portCoordinates[destination]) {
    return [portCoordinates[start], portCoordinates[destination]];
  }

  return null;
};
