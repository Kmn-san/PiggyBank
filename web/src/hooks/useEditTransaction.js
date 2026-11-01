import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editTransaction } from '../lib/api.js'

export default function useEditTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: editTransaction,
        onSuccess: () => {
            // Balances and charts change when an amount changes
            ;['transactions', 'dashboard', 'expenses', 'accounts'].forEach((key) =>
                queryClient.invalidateQueries({ queryKey: [key] })
            )
        },
    })
}