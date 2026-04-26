export interface AdminDashboardResponse {
  totalUsers: number;
  totalListings: number;
  activeListings?: number;
  inactiveListings?: number;
  featuredListings?: number;
  totalMessages: number;
  totalFavorites?: number;
  unreadMessages?: number;
}

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: "USER" | "ADMIN";
  isEnabled?: boolean;
  createdAt?: string;
}

export interface AdminListingItem {
  id: number;
  title: string;
  price?: number;
  brand?: string;
  model?: string;
  manufactureYear?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  userId?: number;
  sellerId?: number;
  sellerName?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface AdminMessageItem {
  id: number;
  carId?: number;
  listingId?: number;
  senderId: number;
  receiverId: number;
  message: string;
  isRead?: boolean;
  sentAt?: string;
  createdAt?: string;
}