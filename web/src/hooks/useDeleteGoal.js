import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGoal } from '../lib/api.js'

export default function useDeleteGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteGoal,
        onSuccess: () => {
            // The goal disappears from the page and from the transfer pickers
            ;['savings', 'dashboard', 'accounts'].forEach((key) =>
                queryClient.invalidateQueries({ queryKey: [key] })
            )
        },
    })
}