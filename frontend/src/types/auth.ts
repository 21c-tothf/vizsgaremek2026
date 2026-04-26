export type UserRole = "USER" | "ADMIN" | string;

export interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginPayload = LoginRequest;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export type RegisterPayload = RegisterRequest;

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username?: string;
  email: string;
  role: UserRole;
}