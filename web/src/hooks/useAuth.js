import { useQuery } from "@tanstack/react-query"
import { fetchUser } from "../lib/api.js"

export const useAuth = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: fetchUser,
        retry: false,
        staleTime: 5 * 60 * 1000
    });
}