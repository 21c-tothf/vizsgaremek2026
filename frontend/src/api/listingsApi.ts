import { apiClient } from "@/api/axios";
import type {
  ListingCreateRequest,
  ListingResponse,
  ListingSearchParams,
  ListingSummaryResponse,
  ListingUpdateRequest,
  UploadImageResponse
} from "@/types/listings";
import type { PaginatedResponse } from "@/types/api";

const LISTINGS_BASE = "/listings";

function normalizeListingsResponse(
  data: PaginatedResponse<ListingSummaryResponse> | ListingSummaryResponse[]
): ListingSummaryResponse[] {
  return Array.isArray(data) ? data : data.content;
}

export const listingsApi = {
  getBrands: async () => {
    const { data } = await apiClient.get<string[]>(`${LISTINGS_BASE}/brands`);
    return data;
  },

  getListings: async (params?: ListingSearchParams) => {
    const { data } = await apiClient.get<PaginatedResponse<ListingSummaryResponse> | ListingSummaryResponse[]>(
      LISTINGS_BASE,
      { params }
    );
    return normalizeListingsResponse(data);
  },

  getListingById: async (id: number | string) => {
    const { data } = await apiClient.get<ListingResponse>(`${LISTINGS_BASE}/${id}`);
    return data;
  },

  /** @deprecated Ugyanaz, mint a getListings — a szűrők a {@code GET /listings?…} query paramjai (nincs külön /search). */
  searchListings: async (params: ListingSearchParams) => {
    const { data } = await apiClient.get<PaginatedResponse<ListingSummaryResponse> | ListingSummaryResponse[]>(
      LISTINGS_BASE,
      { params }
    );
    return normalizeListingsResponse(data);
  },

  createListing: async (payload: ListingCreateRequest) => {
    const { data } = await apiClient.post<ListingResponse>(LISTINGS_BASE, payload);
    return data;
  },

  updateListing: async (id: number | string, payload: ListingUpdateRequest) => {
    const { data } = await apiClient.put<ListingResponse>(`${LISTINGS_BASE}/${id}`, payload);
    return data;
  },

  deleteListing: async (id: number | string) => {
    await apiClient.delete(`${LISTINGS_BASE}/${id}`);
  },

  getMyListings: async () => {
    const { data } = await apiClient.get<ListingSummaryResponse[]>(`${LISTINGS_BASE}/my`);
    return data;
  },

  uploadListingImage: async (listingId: number | string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<UploadImageResponse>(`${LISTINGS_BASE}/${listingId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  },

  deleteImage: async (imageId: number | string) => {
    await apiClient.delete(`/images/${imageId}`);
  }
};