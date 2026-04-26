export interface FavoriteItem {
  id: number;
  userId: number;
  listingId: number;
  listingTitle?: string;
  listingPrice?: number;
  listingImageUrl?: string;
  createdAt?: string;
}