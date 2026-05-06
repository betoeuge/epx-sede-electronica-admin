import { http } from "./http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/api/v1/auth/login", {
      userName: data.email,
      password: data.password,
    });
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/api/v1/auth/refresh", {
      refreshToken,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("sede_refresh_token");
    if (refreshToken) {
      await http.post("/api/v1/auth/logout", { refreshToken }).catch(() => {});
    }
  },
};
