import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteAccount, fetchUserData } from "../lib/api.js"

export const useCurrentUser = () => {
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserData
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAccount
    })

    return {
        ...userQuery,
        deleteAccount: deleteMutation
    }
}