import type { Extra, RentalLocation, Vehicle, VehicleCategory } from "./types";

export const MOCK_CLOCK = "2026-08-10T10:00";

export const locations: RentalLocation[] = [
  { id: "harbor-airport", name: "Harbor International Airport", city: "Harbor City", type: "Airport", address: "1 Terminal Way", timezone: "America/New_York" },
  { id: "harbor-downtown", name: "Harbor City Downtown", city: "Harbor City", type: "City", address: "88 Market Street", timezone: "America/New_York" },
  { id: "summit-airport", name: "Summit Regional Airport", city: "Summit", type: "Airport", address: "400 Skyway Drive", timezone: "America/Denver" },
  { id: "summit-center", name: "Summit City Center", city: "Summit", type: "City", address: "17 Alpine Avenue", timezone: "America/Denver" },
  { id: "sunset-airport", name: "Sunset Coast Airport", city: "Sunset Bay", type: "Airport", address: "9 Pacific Loop", timezone: "America/Los_Angeles" },
  { id: "sunset-marina", name: "Sunset Bay Marina", city: "Sunset Bay", type: "City", address: "250 Marina Walk", timezone: "America/Los_Angeles" },
  { id: "lakeside-station", name: "Lakeside Central Station", city: "Lakeside", type: "City", address: "72 Union Plaza", timezone: "America/Chicago" },
  { id: "capital-airport", name: "Capital Gateway Airport", city: "Capital City", type: "Airport", address: "100 Gateway Boulevard", timezone: "America/Chicago" },
];

const vehicleSeeds: Array<{
  category: VehicleCategory;
  examples: string[];
  passengers: number;
  luggage: number;
  doors: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Hybrid" | "Electric";
  features: string[];
  minimumDriverAge: number;
  rate: number;
  accent: string;
}> = [
  { category: "Economy", examples: ["Nissan Versa", "Kia Rio", "Mitsubishi Mirage", "Hyundai Accent"], passengers: 5, luggage: 2, doors: 4, transmission: "Manual", fuelType: "Petrol", features: ["Bluetooth", "Rear camera", "USB charging"], minimumDriverAge: 21, rate: 4900, accent: "#cfe8df" },
  { category: "Compact", examples: ["Toyota Corolla", "Honda Civic", "Volkswagen Jetta", "Mazda 3"], passengers: 5, luggage: 3, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Adaptive cruise", "CarPlay", "Lane assist"], minimumDriverAge: 21, rate: 6200, accent: "#d9e8fb" },
  { category: "Midsize", examples: ["Toyota Camry", "Honda Accord", "Hyundai Sonata", "Subaru Legacy"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Hybrid", features: ["Dual-zone climate", "CarPlay", "Blind-spot alert"], minimumDriverAge: 21, rate: 7600, accent: "#f4dfc4" },
  { category: "Full-size", examples: ["Chevrolet Malibu", "Nissan Altima", "Chrysler 300", "Volkswagen Arteon"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Premium audio", "Navigation", "Heated seats"], minimumDriverAge: 25, rate: 9100, accent: "#eadcf4" },
  { category: "SUV", examples: ["Toyota RAV4", "Ford Explorer", "Jeep Grand Cherokee", "Subaru Forester"], passengers: 5, luggage: 5, doors: 5, transmission: "Automatic", fuelType: "Hybrid", features: ["All-wheel drive", "Power liftgate", "Adaptive cruise"], minimumDriverAge: 25, rate: 10900, accent: "#d9e0c8" },
  { category: "Luxury", examples: ["BMW 5 Series", "Mercedes E-Class", "Audi A6", "Volvo S90"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Leather interior", "Premium audio", "360 camera"], minimumDriverAge: 25, rate: 16800, accent: "#e6d7c5" },
  { category: "Van", examples: ["Chrysler Pacifica", "Toyota Sienna", "Kia Carnival"], passengers: 7, luggage: 6, doors: 5, transmission: "Automatic", fuelType: "Hybrid", features: ["Power doors", "Three rows", "Rear climate"], minimumDriverAge: 25, rate: 13200, accent: "#d6e4e8" },
  { category: "Electric", examples: ["Tesla Model 3", "Hyundai Ioniq 5", "Kia EV6"], passengers: 5, luggage: 3, doors: 4, transmission: "Automatic", fuelType: "Electric", features: ["300-mile range", "Fast charging", "Navigation"], minimumDriverAge: 25, rate: 12400, accent: "#d7d7ef" },
];

export const vehicles: Vehicle[] = vehicleSeeds.flatMap((seed, seedIndex) =>
  seed.examples.map((example, modelIndex) => ({
    id: `${seed.category.toLowerCase().replaceAll(" ", "-")}-${modelIndex + 1}`,
    category: seed.category,
    name: `${seed.category} ${modelIndex + 1}`,
    example,
    passengers: seed.passengers,
    luggage: seed.luggage,
    doors: seed.doors,
    transmission: seed.transmission,
    fuelType: seed.fuelType,
    features: seed.features,
    minimumDriverAge: seed.minimumDriverAge,
    dailyRate: seed.rate + modelIndex * 500,
    locationIds: locations
      .filter((_, locationIndex) => (locationIndex + modelIndex + seedIndex) % 3 !== 0)
      .map((location) => location.id),
    inventory: (modelIndex + seedIndex) % 4 === 0 ? 1 : 4,
    accent: seed.accent,
  })),
);

export const extras: Extra[] = [
  { id: "protection-basic", name: "Essential protection", description: "Reduced damage responsibility for this demo rental.", pricingModel: "per-day", price: 1800, maxQuantity: 1 },
  { id: "protection-premium", name: "Premium protection", description: "Lowest mock responsibility plus tire and glass cover.", pricingModel: "per-day", price: 3200, maxQuantity: 1 },
  { id: "additional-driver", name: "Additional driver", description: "Add one additional eligible driver.", pricingModel: "per-day", price: 1200, maxQuantity: 2 },
  { id: "child-seat", name: "Child safety seat", description: "Age-appropriate child seat, subject to mock availability.", pricingModel: "per-day", price: 900, maxQuantity: 3 },
  { id: "gps", name: "Portable navigation", description: "A dedicated navigation device.", pricingModel: "per-day", price: 700, maxQuantity: 1 },
  { id: "roadside", name: "Roadside assistance", description: "Expanded roadside support for the rental period.", pricingModel: "per-rental", price: 2400, maxQuantity: 1 },
  { id: "prepaid-fuel", name: "Prepaid fuel", description: "Return without refilling the tank.", pricingModel: "per-rental", price: 6500, maxQuantity: 1 },
];

export const findLocation = (id: string) => locations.find((location) => location.id === id);
export const findVehicle = (id: string) => vehicles.find((vehicle) => vehicle.id === id);
export const findExtra = (id: string) => extras.find((extra) => extra.id === id);
