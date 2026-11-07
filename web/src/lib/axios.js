
import axios from "axios";

const BASE_URI =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URI,
    withCredentials: true
});

// Separate instance: refreshing must not trigger this
// instance's response interceptor again.
const refreshClient = axios.create({
    baseURL: BASE_URI,
    withCredentials: true
});

let refreshPromise = null;

// Refresh expired access token and retry the original request.
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (
            status !== 401 ||
            code !== "ACCESS_TOKEN_EXPIRED" ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient.post("/auth/refresh")
            }
            await refreshPromise;

            return axiosInstance(originalRequest)
        } catch (refreshError) {

            return Promise.reject(refreshError);
        } finally {
            refreshPromise = null;
        }
    }
);
