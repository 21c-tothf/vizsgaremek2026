export type FuelType = "Diesel" | "Petrol" | "Hybrid" | "Electric" | "Other";

export interface CarSummary {
  id: number;
  title: string;
  priceHuf: number;
  mileageKm: number;
  year: number;
  fuelType: FuelType;
  transmission: string;
  location: string;
  thumbnailUrl?: string;
}

export interface CarDetails extends CarSummary {
  description: string;
  images: string[];
  sellerName: string;
  sellerPhone?: string;
}