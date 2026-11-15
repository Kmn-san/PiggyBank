
import axios from "axios";

const BASE_URI =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URI,
    withCredentials: true
});

const refreshClient = axios.create({
    baseURL: BASE_URI,
    withCredentials: true
});

let refreshPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (!originalRequest || status !== 401) {
            return Promise.reject(error);
        }

        // Never refresh login, register, logout or refresh requests
        const excludedUrls = [
            "/auth/login",
            "/auth/register",
            "/auth/logout",
            "/auth/refresh"
        ];

        if (
            excludedUrls.some((url) =>
                originalRequest.url?.includes(url)
            )
        ) {
            return Promise.reject(error);
        }

        // Only refresh when access token has expired.
        // NO_ACCESS_TOKEN should not automatically trigger refresh.
        if (
            code !== "ACCESS_TOKEN_EXPIRED" ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post("/auth/refresh")
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;

            return axiosInstance(originalRequest);

        } catch (refreshError) {
            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }

            return Promise.reject(refreshError);
        }
    }
);
