// hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import { fetchSavings } from "../lib/api";

export const useSavings = () => {
    return useQuery({
        queryKey: ["savings"],
        queryFn: async () => fetchSavings()
    });
};