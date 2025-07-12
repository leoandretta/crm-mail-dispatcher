import { env } from "@/config/env";
import axios from "axios";

type APIResponseSuccess<E> = { success: true; data: E }
type APIResponseError = { success: false; }

export type APIResponse<E> = { message: string; } & (APIResponseSuccess<E> | APIResponseError)

export const api = axios.create({
    baseURL: env.api,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.get("/auth/refresh", { withCredentials: true });
        const newToken = refreshResponse.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh failed", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
