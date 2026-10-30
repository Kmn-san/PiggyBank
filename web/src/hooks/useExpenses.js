import { useQuery } from "@tanstack/react-query";
import { fetchExpenses } from "../lib/api";

export const useExpenses = (month) => {
    return useQuery({
        queryKey: ["expenses", month],
        queryFn: async () => fetchExpenses(month)
    });
};