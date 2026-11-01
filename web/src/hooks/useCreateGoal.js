import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGoal } from '../lib/api.js'

export default function useCreateGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createGoal,
        onSuccess: () => {
            // The new account must appear on the Savings page and in the transfer pickers
            ;['savings', 'dashboard'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
        },
    })
}