import axios from "axios";
import type {
  ApiResponse,
  RefreshData,
} from "../features/auth/types/auth.types";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the Access Token
api.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request, and it's not the refresh request itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      // Avoid initiating multiple refresh requests at the same time
      if (!refreshPromise) {
        refreshPromise = api
          .post<ApiResponse<RefreshData>>("/auth/refresh")
          .then((res) => {
            const token = res.data.data.accessToken;
            setAccessToken(token);
            refreshPromise = null;
            return token;
          })
          .catch((refreshError) => {
            setAccessToken(null);
            refreshPromise = null;

            // Notify AuthContext to log out the user
            window.dispatchEvent(new Event("auth-logout"));

            return Promise.reject(refreshError);
          });
      }

      try {
        const token = await refreshPromise;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);