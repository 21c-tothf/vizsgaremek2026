import { apiClient } from "@/api/axios";
import type { FavoriteItem } from "@/types/favorites";

const FAVORITES_BASE = "/favorites";

export const favoritesApi = {
  addFavorite: async (listingId: number | string) => {
    const { data } = await apiClient.post<FavoriteItem>(`${FAVORITES_BASE}/${listingId}`);
    return data;
  },

  removeFavorite: async (listingId: number | string) => {
    await apiClient.delete(`${FAVORITES_BASE}/${listingId}`);
  },

  getFavorites: async () => {
    const { data } = await apiClient.get<FavoriteItem[]>(FAVORITES_BASE);
    return data;
  }
};