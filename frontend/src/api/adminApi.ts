import { apiClient } from "@/api/axios";
import type {
  AdminDashboardResponse,
  AdminListingItem,
  AdminMessageItem,
  AdminUserItem
} from "@/types/admin";

const ADMIN_BASE = "/admin";

export const adminApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<AdminDashboardResponse>(`${ADMIN_BASE}/dashboard`);
    return data;
  },

  getUsers: async () => {
    const { data } = await apiClient.get<AdminUserItem[]>(`${ADMIN_BASE}/users`);
    return data;
  },

  deleteUser: async (id: number | string) => {
    await apiClient.delete(`${ADMIN_BASE}/users/${id}`);
  },

  enableUser: async (id: number | string) => {
    const { data } = await apiClient.patch<AdminUserItem>(`${ADMIN_BASE}/users/${id}/enable`);
    return data;
  },

  disableUser: async (id: number | string) => {
    const { data } = await apiClient.patch<AdminUserItem>(`${ADMIN_BASE}/users/${id}/disable`);
    return data;
  },

  getListings: async () => {
    const { data } = await apiClient.get<AdminListingItem[]>(`${ADMIN_BASE}/listings`);
    return data;
  },

  enableListing: async (id: number | string) => {
    const { data } = await apiClient.patch<AdminListingItem>(`${ADMIN_BASE}/listings/${id}/enable`);
    return data;
  },

  disableListing: async (id: number | string) => {
    const { data } = await apiClient.patch<AdminListingItem>(`${ADMIN_BASE}/listings/${id}/disable`);
    return data;
  },

  deleteListing: async (id: number | string) => {
    await apiClient.delete(`${ADMIN_BASE}/listings/${id}`);
  },

  getMessages: async () => {
    const { data } = await apiClient.get<AdminMessageItem[]>(`${ADMIN_BASE}/messages`);
    return data;
  },

  markMessageRead: async (id: number | string) => {
    const { data } = await apiClient.patch<AdminMessageItem>(`${ADMIN_BASE}/messages/${id}/read`);
    return data;
  }
};