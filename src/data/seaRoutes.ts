import { findShortestPath } from "./pathfinding";
import { portCoordinates } from "./ports";
import { type Node } from "./maritimeGraph";

type Route = [number, number][];

export interface RouteResult {
  coordinates: [number, number][];
  nodes: Node[];
}

// We no longer use hardcoded routes.
// However, for backward compatibility with components that might iterate this object
// (like the RouteForm extracting port names), we will export a proxy or placeholder.
// Ideally, RouteForm should just use Object.keys(portCoordinates).
export const allRoutes: { [key: string]: Route } = {};

// Populate allRoutes with dummy data just so the keys exist for the UI to extract ports
// This is a temporary bridge until RouteForm is updated to use portCoordinates directly.
const ports = Object.keys(portCoordinates);
ports.forEach(p1 => {
  ports.forEach(p2 => {
    if (p1 !== p2) {
      allRoutes[`${p1}-${p2}`] = []; // Empty route, data doesn't matter, only keys for now
    }
  });
});

export const getSeaRoute = (start: string, destination: string): RouteResult | null => {
  // Use the new graph-based pathfinding
  const pathNodes = findShortestPath(start, destination);
  
  if (pathNodes) {
    const coordinates = pathNodes.map(node => [node.lat, node.lng] as [number, number]);
    // Ensure the specific start/end coordinates from ports.ts are used exactly at the ends
    // (The graph uses them, but good to be explicit if graph has slight deviations)
    const startCoord = portCoordinates[start];
    const endCoord = portCoordinates[destination];
    
    if (startCoord && endCoord) {
        // We could overwrite the first and last coordinates here if we wanted strict equality
        // with portCoordinates, but the graph nodes should be consistent.
    }
    
    return {
        coordinates,
        nodes: pathNodes
    };
  }

  // Fallback to direct line if pathfinding fails (e.g. disconnected graph node)
  if (portCoordinates[start] && portCoordinates[destination]) {
    console.warn(`Pathfinding failed for ${start} -> ${destination}. Using direct line.`);
    return {
        coordinates: [portCoordinates[start], portCoordinates[destination]],
        nodes: [] // No intermediate nodes known
    };
  }

  return null;
};