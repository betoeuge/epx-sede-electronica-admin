import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Todas las llamadas van a través del proxy server-side de Next.js (/api/proxy)
// para evitar problemas de CORS y acceso a localhost en entornos cloud (Coder, etc.)
// El proxy recibe el path en el query param _path y lo reenvía al backend.
function buildProxyUrl(path: string) {
  return `/api/proxy?_path=${encodeURIComponent(path)}`;
}

export const http = axios.create({
  headers: { "Content-Type": "application/json" },
});

// Rewrite every request through the Next.js proxy
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sede_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Rewrite the URL: /api/v1/auth/login → /api/proxy?_path=/api/v1/auth/login
  if (config.url && !config.url.startsWith("/api/proxy")) {
    config.url = buildProxyUrl(config.url);
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

function drainQueue(token: string | null, error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) =>
    token ? resolve(token) : reject(error)
  );
  pendingQueue = [];
}

// Auto-refresh on 401
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("sede_refresh_token")
        : null;

    if (!refreshToken) {
      if (typeof window !== "undefined") {
        document.cookie = "sede_token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        buildProxyUrl("/api/v1/auth/refresh"),
        { refreshToken }
      );
      const newToken: string = data.token;
      localStorage.setItem("sede_token", newToken);
      if (data.refreshToken) {
        localStorage.setItem("sede_refresh_token", data.refreshToken);
      }
      drainQueue(newToken, null);
      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (err) {
      drainQueue(null, err);
      localStorage.removeItem("sede_token");
      localStorage.removeItem("sede_refresh_token");
      if (typeof window !== "undefined") {
        document.cookie = "sede_token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = "/login";
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

/** @deprecated El proxy server-side maneja la URL del backend. Solo conservado para compatibilidad. */
export function setHttpBaseUrl(_url: string) {
  // no-op: the proxy reads BACKEND_URL from the server environment
}
