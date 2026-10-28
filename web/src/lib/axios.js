
import axios from "axios";

const BASE_URI =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URI,
});

// Separate instance: refreshing must not trigger this
// instance's response interceptor again.
const refreshClient = axios.create({
    baseURL: BASE_URI,
});

let refreshPromise = null;

const clearSession = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiresIn");

    const qrEntryPath = sessionStorage.getItem("qrEntryPath");

    window.location.href = qrEntryPath || "/login";
};

// Attach access token to requests.
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

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
            // Reuse one refresh request if several API calls
            // fail at approximately the same time.
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshToken =
                        sessionStorage.getItem("refreshToken");

                    if (!refreshToken) {
                        throw new Error("Refresh token missing.");
                    }

                    const { data } = await refreshClient.post(
                        "/auth/refresh",
                        { refreshToken }
                    );

                    const {
                        accessToken,
                        refreshToken: newRefreshToken,
                        expiresIn
                    } = data;

                    if (!accessToken) {
                        throw new Error("Access token missing from response.");
                    }

                    sessionStorage.setItem("token", accessToken);

                    // If your backend rotates refresh tokens,
                    // save the newly issued token too.
                    if (newRefreshToken) {
                        sessionStorage.setItem(
                            "refreshToken",
                            newRefreshToken
                        );
                    }

                    if (expiresIn != null) {
                        sessionStorage.setItem(
                            "expiresIn",
                            String(expiresIn)
                        );
                    }

                    return accessToken;
                })();
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            clearSession();
            return Promise.reject(refreshError);
        } finally {
            refreshPromise = null;
        }
    }
);
