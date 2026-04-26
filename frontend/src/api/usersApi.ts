import { apiClient } from "@/api/axios";
import type { UpdateUserMeRequest, UserMeResponse } from "@/types/account";

const USERS_BASE = "/users";

export const usersApi = {
  getMe: async () => {
    const { data } = await apiClient.get<UserMeResponse>(`${USERS_BASE}/me`);
    return data;
  },

  updateMe: async (payload: UpdateUserMeRequest) => {
    const { data } = await apiClient.put<UserMeResponse>(`${USERS_BASE}/me`, payload);
    return data;
  }
};