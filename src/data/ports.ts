export const portCoordinates: { [key: string]: [number, number] } = {
  // Coordinates adjusted to be clearly in the water at port entrances
  // European Ports
  "Bremerhaven": [53.58, 8.52],
  "Rotterdam": [51.95, 4.00], // Approach from North Sea
  "Aarhus": [56.16, 10.25],
  "Copenhagen": [55.70, 12.64],

  // Asian Ports
  "Singapore": [1.20, 103.85], // Singapore Strait South
  "Shanghai": [30.62, 122.07],
  "Tokyo": [35.60, 139.90],
  "Hong Kong": [22.15, 114.25], // East Lamma Channel
  "Busan": [35.05, 129.10],
  "Dubai": [25.05, 54.95], // Jebel Ali approach
  "Mumbai": [18.90, 72.75],

  // American Ports
  "New York": [40.45, -73.90], // Ambrose Light area
  "Los Angeles": [33.70, -118.28],
  "San Francisco": [37.80, -122.55], // Outside Golden Gate
  "Santos": [-24.05, -46.30],
  
  // African/Oceania Ports
  "Cape Town": [-33.85, 18.35],
  "Sydney": [-33.82, 151.35] // Sydney Heads
};

export const portRegions: { [key: string]: string } = {
  "Bremerhaven": "Europa",
  "Rotterdam": "Europa",
  "Aarhus": "Europa",
  "Copenhagen": "Europa",
  "Singapore": "Asien",
  "Shanghai": "Asien",
  "Tokyo": "Asien",
  "Hong Kong": "Asien",
  "Busan": "Asien",
  "Dubai": "Asien",
  "Mumbai": "Asien",
  "New York": "Nordamerika",
  "Los Angeles": "Nordamerika",
  "San Francisco": "Nordamerika",
  "Santos": "Sydamerika",
  "Cape Town": "Afrika",
  "Sydney": "Oceanien"
};
