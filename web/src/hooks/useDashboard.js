// hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { fetchDashboard } from "../lib/api";

export const useDashboard = (month) => {
    return useQuery({
        queryKey: ["dashboard", month],

        queryFn: async () => fetchDashboard()

    });
};