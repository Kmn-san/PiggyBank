import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transferAccounts } from '../lib/api.js'

export default function useTransferAccounts() {
    const queryClient = useQueryClient()

    return useMutation({
        // React Query passes ONE argument, so take an object
        mutationFn: ({ amount, fromAccount, toAccount }) =>
            transferAccounts(amount, fromAccount, toAccount),
        onSuccess: () => {
            // Refresh every page that shows balances or transactions
            ;['dashboard', 'transactions', 'expenses'].forEach((key) =>
                queryClient.invalidateQueries({ queryKey: [key] })
            )
        },
    })
}