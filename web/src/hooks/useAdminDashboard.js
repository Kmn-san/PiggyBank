import { useQuery } from "@tanstack/react-query"
import { fetchAdminDashboard } from "../lib/api.js"

export const useAdminDashboard = ({ startDate, endDate }) => {

    return useQuery({
        queryKey: ['admin', startDate, endDate],
        queryFn: () => fetchAdminDashboard(startDate, endDate)
    })
}