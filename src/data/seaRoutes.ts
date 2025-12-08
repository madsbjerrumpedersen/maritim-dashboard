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

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getSeaRoute = (start: string, destination: string): RouteResult | null => {
  // Use the new graph-based pathfinding
  const pathNodes = findShortestPath(start, destination);
  
  if (pathNodes && pathNodes.length > 0) {
    const highResNodes: Node[] = [];
    const MAX_SEGMENT_KM = 25; // Target max distance between points

    for (let i = 0; i < pathNodes.length - 1; i++) {
        const current = pathNodes[i];
        const next = pathNodes[i+1];
        
        highResNodes.push(current);

        const dist = haversineDistance(current.lat, current.lng, next.lat, next.lng);
        
        if (dist > MAX_SEGMENT_KM) {
            const numSteps = Math.ceil(dist / MAX_SEGMENT_KM);
            for (let k = 1; k < numSteps; k++) {
                const fraction = k / numSteps;
                const lat = current.lat + (next.lat - current.lat) * fraction;
                const lng = current.lng + (next.lng - current.lng) * fraction;
                
                highResNodes.push({
                    id: `interpolated_${current.id}_${k}`,
                    lat,
                    lng,
                    isCity: false,
                    neighbors: [] 
                });
            }
        }
    }
    // Add the last node
    highResNodes.push(pathNodes[pathNodes.length - 1]);

    const coordinates = highResNodes.map(node => [node.lat, node.lng] as [number, number]);
    
    return {
        coordinates,
        nodes: highResNodes
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