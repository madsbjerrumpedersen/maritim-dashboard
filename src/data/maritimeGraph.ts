// Define the graph structure types
export type NodeId = string;

export interface Node {
  id: NodeId;
  lat: number;
  lng: number;
}

export interface Edge {
  from: NodeId;
  to: NodeId;
  distance: number; // Approximate nautical distance or cost
  waypoints?: [number, number][]; // Detailed path for this edge (curved lines)
}

export const MARITIME_NODES: Record<NodeId, Node> = {
  // --- Ports (Must match keys in ports.ts closely or be mapped) ---
  "Bremerhaven": { id: "Bremerhaven", lat: 53.58, lng: 8.52 },
  "Rotterdam": { id: "Rotterdam", lat: 51.95, lng: 4.00 },
  "Aarhus": { id: "Aarhus", lat: 56.16, lng: 10.25 },
  "Copenhagen": { id: "Copenhagen", lat: 55.70, lng: 12.64 },
  "New York": { id: "New York", lat: 40.45, lng: -73.90 },
  "Los Angeles": { id: "Los Angeles", lat: 33.70, lng: -118.28 },
  "San Francisco": { id: "San Francisco", lat: 37.80, lng: -122.55 },
  "Santos": { id: "Santos", lat: -24.05, lng: -46.30 },
  "Cape Town": { id: "Cape Town", lat: -33.85, lng: 18.35 },
  "Sydney": { id: "Sydney", lat: -33.82, lng: 151.35 },
  "Singapore": { id: "Singapore", lat: 1.20, lng: 103.85 },
  "Shanghai": { id: "Shanghai", lat: 30.62, lng: 122.07 },
  "Tokyo": { id: "Tokyo", lat: 35.60, lng: 139.90 },
  "Hong Kong": { id: "Hong Kong", lat: 22.15, lng: 114.25 },
  "Busan": { id: "Busan", lat: 35.05, lng: 129.10 },
  "Dubai": { id: "Dubai", lat: 25.05, lng: 54.95 },
  "Mumbai": { id: "Mumbai", lat: 18.90, lng: 72.75 },

  // --- Junctions / Waypoints ---
  "Skagen": { id: "Skagen", lat: 57.8, lng: 10.6 },
  "Sound_North": { id: "Sound_North", lat: 56.12, lng: 12.60 },
  "Kattegat_Anholt": { id: "Kattegat_Anholt", lat: 56.70, lng: 11.85 },
  "GermanBight": { id: "GermanBight", lat: 54.0, lng: 7.5 },
  "EnglishChannel_East": { id: "EnglishChannel_East", lat: 51.1, lng: 1.5 },
  "EnglishChannel_West": { id: "EnglishChannel_West", lat: 48.6, lng: -6.3 }, // Ushant
  "Portugal_South": { id: "Portugal_South", lat: 36.5, lng: -9.5 }, // Off Cape St Vincent
  "Gibraltar_West": { id: "Gibraltar_West", lat: 35.9, lng: -6.0 },
  "Gibraltar_East": { id: "Gibraltar_East", lat: 36.0, lng: -5.0 },
  "Suez_North": { id: "Suez_North", lat: 31.5, lng: 32.3 },
  "Suez_South": { id: "Suez_South", lat: 29.5, lng: 32.5 },
  "BabElMandeb": { id: "BabElMandeb", lat: 12.5, lng: 43.5 },
  "SriLanka_South": { id: "SriLanka_South", lat: 5.6, lng: 80.4 },
  "Malacca_North": { id: "Malacca_North", lat: 6.1, lng: 95.0 }, // Banda Aceh
  "Singapore_West": { id: "Singapore_West", lat: 1.25, lng: 103.5 },
  "Singapore_East": { id: "Singapore_East", lat: 1.3, lng: 104.3 },
  "SouthChinaSea_South": { id: "SouthChinaSea_South", lat: 3.5, lng: 105.5 },
  "LuzonStrait": { id: "LuzonStrait", lat: 20.0, lng: 120.0 },
  "Taiwan_North": { id: "Taiwan_North", lat: 25.5, lng: 122.0 },
  "Panama_Carib": { id: "Panama_Carib", lat: 9.4, lng: -79.9 },
  "Panama_Pacific": { id: "Panama_Pacific", lat: 8.5, lng: -79.5 },
  "CapeHatteras": { id: "CapeHatteras", lat: 35.0, lng: -75.0 }, // US East Coast pivot
  "FloridaStraits": { id: "FloridaStraits", lat: 24.5, lng: -80.5 },
  "NorthAtlantic_Mid": { id: "NorthAtlantic_Mid", lat: 48.0, lng: -35.0 }, // Crossing point
  "GoodHope": { id: "GoodHope", lat: -35.0, lng: 19.0 }, // South Africa tip
  "HornOfBrazil": { id: "HornOfBrazil", lat: -5.0, lng: -35.0 },
  "Pacific_Mid": { id: "Pacific_Mid", lat: 35.0, lng: -160.0 } // Waypoint for Trans-Pacific
};

// Define connections. Distance is abstract for now (1 = close, 10 = far). 
// Waypoints draw the line.
export const MARITIME_EDGES: Edge[] = [
  // --- Europe Internal ---
  { from: "Copenhagen", to: "Sound_North", distance: 0.5 },
  { from: "Sound_North", to: "Kattegat_Anholt", distance: 1.5 },
  { from: "Aarhus", to: "Kattegat_Anholt", distance: 1.5, waypoints: [[55.95, 10.35], [56.00, 10.85], [56.40, 11.40]] },
  { from: "Kattegat_Anholt", to: "Skagen", distance: 1.5 },
  { from: "Skagen", to: "GermanBight", distance: 2, waypoints: [[57.0, 8.0]] },
  { from: "Bremerhaven", to: "GermanBight", distance: 1 },
  { from: "GermanBight", to: "Rotterdam", distance: 2, waypoints: [[53.5, 5.0]] },
  { from: "Rotterdam", to: "EnglishChannel_East", distance: 2 },
  
  // --- English Channel & Atlantic ---
  { from: "EnglishChannel_East", to: "EnglishChannel_West", distance: 5, waypoints: [[50.5, 0.0], [49.8, -3.0]] },
  { from: "EnglishChannel_West", to: "Portugal_South", distance: 8, waypoints: [[43.5, -11.0]] },
  { from: "Portugal_South", to: "Gibraltar_West", distance: 2 },
  { from: "EnglishChannel_West", to: "NorthAtlantic_Mid", distance: 15, waypoints: [[49.0, -15.0]] },
  
  // --- Mediterranean ---
  { from: "Gibraltar_West", to: "Gibraltar_East", distance: 1 },
  { from: "Gibraltar_East", to: "Suez_North", distance: 20, waypoints: [[37.5, 5.0], [37.6, 11.0], [35.5, 16.0], [33.5, 25.0]] },
  { from: "Suez_North", to: "Suez_South", distance: 1 }, // The Canal
  
  // --- Indian Ocean ---
  { from: "Suez_South", to: "BabElMandeb", distance: 15, waypoints: [[24.0, 36.0], [16.0, 41.0]] },
  { from: "BabElMandeb", to: "Dubai", distance: 15, waypoints: [[14.0, 53.0], [26.5, 56.5]] },
  { from: "BabElMandeb", to: "Mumbai", distance: 18, waypoints: [[14.0, 55.0]] },
  { from: "BabElMandeb", to: "SriLanka_South", distance: 25, waypoints: [[12.0, 52.0], [8.0, 70.0]] },
  { from: "Mumbai", to: "SriLanka_South", distance: 10 },
  { from: "Dubai", to: "SriLanka_South", distance: 15, waypoints: [[22.0, 62.0]] },
  { from: "SriLanka_South", to: "Malacca_North", distance: 12, waypoints: [[6.0, 88.0]] },
  
  // --- SE Asia ---
  { from: "Malacca_North", to: "Singapore_West", distance: 8, waypoints: [[5.2, 98.0], [3.8, 100.2], [2.8, 101.2]] },
  { from: "Singapore_West", to: "Singapore", distance: 1 },
  { from: "Singapore", to: "Singapore_East", distance: 1 },
  { from: "Singapore_East", to: "SouthChinaSea_South", distance: 2 },
  
  // --- East Asia ---
  { from: "SouthChinaSea_South", to: "Hong Kong", distance: 12, waypoints: [[7.0, 109.0], [15.0, 112.0]] },
  { from: "SouthChinaSea_South", to: "LuzonStrait", distance: 15, waypoints: [[12.0, 113.0], [16.0, 116.0]] },
  { from: "Hong Kong", to: "Taiwan_North", distance: 6, waypoints: [[24.0, 118.5]] },
  { from: "Taiwan_North", to: "Shanghai", distance: 4 },
  { from: "Shanghai", to: "Busan", distance: 5, waypoints: [[32.0, 125.0]] },
  { from: "Shanghai", to: "Tokyo", distance: 10, waypoints: [[31.0, 128.0], [33.0, 135.0]] },
  { from: "LuzonStrait", to: "Tokyo", distance: 15, waypoints: [[25.0, 128.0]] },

  // --- Trans-Pacific ---
  { from: "Tokyo", to: "Pacific_Mid", distance: 30, waypoints: [[36.0, 150.0], [40.0, 180.0]] },
  { from: "Pacific_Mid", to: "San Francisco", distance: 20, waypoints: [[37.0, -130.0]] },
  { from: "Pacific_Mid", to: "Los Angeles", distance: 20, waypoints: [[35.0, -130.0]] },
  { from: "LuzonStrait", to: "Pacific_Mid", distance: 40, waypoints: [[22.0, 140.0]] }, // Southern route
  
  // --- Americas (Atlantic) ---
  { from: "NorthAtlantic_Mid", to: "New York", distance: 20, waypoints: [[45.0, -48.0], [41.0, -65.0]] },
  { from: "New York", to: "CapeHatteras", distance: 5 },
  { from: "CapeHatteras", to: "FloridaStraits", distance: 8, waypoints: [[30.0, -78.0]] },
  { from: "FloridaStraits", to: "Panama_Carib", distance: 12, waypoints: [[22.0, -85.0], [15.0, -81.0]] },
  
  // --- Americas (Pacific) ---
  { from: "Panama_Carib", to: "Panama_Pacific", distance: 1 }, // The Canal
  { from: "Panama_Pacific", to: "Los Angeles", distance: 25, waypoints: [[10.0, -90.0], [20.0, -110.0]] },
  { from: "Los Angeles", to: "San Francisco", distance: 4 },
  
  // --- South Atlantic ---
  { from: "EnglishChannel_West", to: "HornOfBrazil", distance: 40, waypoints: [[30.0, -25.0], [10.0, -30.0]] },
  { from: "New York", to: "HornOfBrazil", distance: 35, waypoints: [[30.0, -60.0], [10.0, -50.0]] },
  { from: "HornOfBrazil", to: "Santos", distance: 15, waypoints: [[-15.0, -36.0]] },
  { from: "HornOfBrazil", to: "Cape Town", distance: 35, waypoints: [[-20.0, -10.0]] },
  { from: "Gibraltar_West", to: "Cape Town", distance: 50, waypoints: [[10.0, -20.0], [-10.0, -10.0]] },
  { from: "GoodHope", to: "Cape Town", distance: 1 },
  { from: "GoodHope", to: "SriLanka_South", distance: 50, waypoints: [[-20.0, 50.0]] }, // Indian Ocean Crossing
  { from: "GoodHope", to: "Sydney", distance: 60, waypoints: [[-40.0, 80.0], [-40.0, 120.0]] },
  
  // --- Oceania ---
  { from: "Sydney", to: "LuzonStrait", distance: 45, waypoints: [[-10.0, 152.0], [0.0, 145.0]] } // simplified
];
