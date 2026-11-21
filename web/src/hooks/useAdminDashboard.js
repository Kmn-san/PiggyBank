
import { useQuery } from "@tanstack/react-query"
import {
    fetchAdminDashboard,
    fetchAdminParticipants,
} from "../lib/api.js"

export const useAdminDashboard = ({
    startDate,
    endDate,
    participantIds = [],
    enabled = true,
}) => {
    // Sort IDs so different selection orders use the same cache key
    const sortedIds = [...participantIds].sort()

    return useQuery({
        queryKey: ["admin", startDate, endDate, sortedIds],
        queryFn: () =>
            fetchAdminDashboard(startDate, endDate, sortedIds),
        enabled: enabled && !!startDate && !!endDate,
    })
}

export const useAdminParticipants = () => {
    return useQuery({
        queryKey: ["admin", "participants"],
        queryFn: fetchAdminParticipants,
        staleTime: 5 * 60 * 1000,
    })
}
