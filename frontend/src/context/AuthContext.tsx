import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { authApi } from "@/api/authApi";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser
} from "@/api/authStorage";
import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  UserRole
} from "@/types/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<CurrentUser | null>(getStoredUser);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    function handleUnauthorized() {
      setToken(null);
      setUser(null);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    setIsBootstrapping(false);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const buildCurrentUser = useCallback((auth: AuthResponse): CurrentUser => {
    const displayName = auth.username || auth.email.split("@")[0] || "User";
    return {
      id: auth.userId,
      email: auth.email,
      role: auth.role,
      displayName
    };
  }, []);

  const persistAuth = useCallback((auth: AuthResponse) => {
    const mappedUser = buildCurrentUser(auth);
    setToken(auth.accessToken);
    setUser(mappedUser);
    setStoredToken(auth.accessToken);
    setStoredUser(mappedUser);
  }, [buildCurrentUser]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const data = await authApi.login(payload);
      persistAuth(data);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const data = await authApi.register(payload);
      persistAuth(data);
    },
    [persistAuth]
  );

  const hasRole = useCallback(
    (role: UserRole) => user?.role.toUpperCase().includes(String(role).toUpperCase()) ?? false,
    [user]
  );

  const isAdmin = hasRole("ADMIN");
  const isLoggedIn = Boolean(token);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: isLoggedIn,
      isLoggedIn,
      isAdmin,
      isBootstrapping,
      login,
      register,
      hasRole,
      logout
    }),
    [hasRole, isAdmin, isBootstrapping, isLoggedIn, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}