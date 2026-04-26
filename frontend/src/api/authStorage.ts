import type { CurrentUser } from "@/types/auth";

export const AUTH_TOKEN_STORAGE_KEY = "egyszeruauto_token";
export const AUTH_USER_STORAGE_KEY = "egyszeruauto_user";

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredUser(): CurrentUser | null {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

export function setStoredUser(user: CurrentUser) {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function clearAuthStorage() {
  clearStoredToken();
  clearStoredUser();
}