export type FuelType = "Diesel" | "Petrol" | "Hybrid" | "Electric" | "LPG" | "Other" | string;

export interface ListingImage {
  id: number;
  imageUrl?: string;
  imagePath?: string;
  isPrimary?: boolean;
}

export interface ListingSummaryResponse {
  id: number;
  title: string;
  price: number;
  brand: string;
  model: string;
  manufactureYear: number;
  mileage: number;
  location: string;
  coverImageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface ListingResponse extends ListingSummaryResponse {
  description: string;
  userId: number;
  fuelType: FuelType;
  transmission: string;
  bodyType: string;
  color?: string;
  engineSize?: number;
  horsepower?: number;
  sellerName: string;
  sellerPhone?: string;
  sellerEmail?: string;
  isActive?: boolean;
  favoriteCount?: number;
  createdAt?: string;
  updatedAt?: string;
  images: ListingImage[];
}

export interface ListingCreateRequest {
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  manufactureYear: number;
  mileage: number;
  fuelType: FuelType;
  transmission: string;
  bodyType: string;
  color: string;
  engineSize: number;
  horsepower: number;
  location: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ListingUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  brand?: string;
  model?: string;
  manufactureYear?: number;
  mileage?: number;
  fuelType?: FuelType;
  transmission?: string;
  bodyType?: string;
  color?: string;
  engineSize?: number;
  horsepower?: number;
  location?: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ListingSearchParams {
  query?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyType?: string;
  fuelType?: FuelType;
  transmission?: string;
  location?: string;
  minYear?: number;
  maxYear?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  size?: number;
  sort?: string;
}

export interface UploadImageResponse {
  id: number;
  imageUrl: string;
  listingId: number;
}