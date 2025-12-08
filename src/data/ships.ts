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
    maxSpeed: 27,
    fuelConsumptionAtCruise: 200, // Approx heavy fuel
    co2Factor: 3.114, // Heavy Fuel Oil (HFO) factor
    windage: 0.8 // High windage due to container stacks
  },
  "arctic_princess": {
    id: "arctic_princess",
    name: "Arctic Princess (LNG)",
    type: "tanker",
    cruiseSpeed: 19.5,
    maxSpeed: 22,
    fuelConsumptionAtCruise: 140, // More efficient, often gas powered
    co2Factor: 2.75, // LNG factor
    windage: 0.4 // Lower profile
  },
  "bulk_shanghai": {
    id: "bulk_shanghai",
    name: "Bulk Shanghai (Bulk)",
    type: "bulk",
    cruiseSpeed: 14,
    maxSpeed: 16,
    fuelConsumptionAtCruise: 110, // Slower is cheaper
    co2Factor: 3.114,
    windage: 0.3 // Low profile when loaded
  },
  "royal_caribbean": {
    id: "royal_caribbean",
    name: "Harmony of Seas (Cruise)",
    type: "cruise",
    cruiseSpeed: 22,
    maxSpeed: 25,
    fuelConsumptionAtCruise: 250, // Hotel load is huge
    co2Factor: 3.114,
    windage: 0.9 // Floating apartment block
  }
};

export const DEFAULT_SHIP = SHIPS["emma_maersk"];
