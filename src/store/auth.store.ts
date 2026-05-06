import { create } from "zustand";

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("sede_token") : null,
  user: null,
  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sede_token", token);
    }
    set({ token, user });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sede_token");
    }
    set({ token: null, user: null });
  },
}));
