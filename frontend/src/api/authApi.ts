import { apiClient } from "@/api/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from "@/types/auth";

const AUTH_BASE = "/auth";

export const authApi = {
  register: async (payload: RegisterRequest) => {
    const { data } = await apiClient.post<AuthResponse>(`${AUTH_BASE}/register`, payload);
    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, payload);
    return data;
  }
};