export interface ShipProfile {
  id: string;
  name: string;
  type: 'container' | 'bulk' | 'tanker' | 'cruise';
  cruiseSpeed: number; // knots
  maxSpeed: number; // knots
  fuelConsumptionAtCruise: number; // kg per nautical mile
  co2Factor: number; // kg CO2 per kg fuel
  windage: number; // 0-1 factor: how much wind affects speed (high for container/cruise)
}

export const SHIPS: Record<string, ShipProfile> = {
  "emma_maersk": {
    id: "emma_maersk",
    name: "Emma Mærsk (Container)",
    type: "container",
    cruiseSpeed: 24,
    maxSpeed: 27, // Sea trials reached 27+, service max is ~25.5
    // Real world: ~225 tons/day at 24 knots. 
    // Calculation: (225 * 1000) / (24 * 24) ≈ 390 kg/nm
    fuelConsumptionAtCruise: 390, 
    co2Factor: 3.114, // HFO
    windage: 0.75 // High windage, but streamlined for speed
  },
  "arctic_princess": {
    id: "arctic_princess",
    name: "Arctic Princess (LNG)",
    type: "tanker",
    cruiseSpeed: 19.5,
    maxSpeed: 21,
    // Real world: Steam Turbine Moss-type. Less efficient than modern DFDE.
    // ~150 tons HFO equivalent/day at 19.5 knots.
    // Calculation: (150 * 1000) / (19.5 * 24) ≈ 320 kg/nm
    fuelConsumptionAtCruise: 320, 
    co2Factor: 2.75, // LNG (Methane) burning has lower CO2 factor than HFO
    windage: 0.5 // High freeboard due to spherical tanks (Moss type)
  },
  "bulk_shanghai": {
    id: "bulk_shanghai",
    name: "Bulk Shanghai (Capesize)",
    type: "bulk",
    cruiseSpeed: 13, // Economical speed for Capesize
    maxSpeed: 15,
    // Real world: ~45 tons/day at 13 knots (Eco speed).
    // Calculation: (45 * 1000) / (13 * 24) ≈ 144 kg/nm
    fuelConsumptionAtCruise: 144, 
    co2Factor: 3.114,
    windage: 0.35 // Low profile when loaded, high when in ballast
  },
  "royal_caribbean": {
    id: "royal_caribbean",
    name: "Harmony of Seas (Cruise)",
    type: "cruise",
    cruiseSpeed: 22,
    maxSpeed: 25,
    // Real world: ~250 tons/day total (Propulsion + massive Hotel Load).
    // Calculation: (250 * 1000) / (22 * 24) ≈ 473 kg/nm
    fuelConsumptionAtCruise: 473, 
    co2Factor: 3.114,
    windage: 0.95 // Maximum windage (floating apartment block)
  }
};

export const DEFAULT_SHIP = SHIPS["emma_maersk"];
