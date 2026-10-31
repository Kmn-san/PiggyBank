import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transferAccounts, transferExpenses, transferIncome } from '../lib/api.js'

export default function useTransferAccounts() {
    const queryClient = useQueryClient()

    const onSuccess = () => {
        ;['dashboard', 'transactions', 'expenses'].forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
        )
    }

    const income = useMutation({ mutationFn: transferIncome, onSuccess })
    const expense = useMutation({ mutationFn: transferExpenses, onSuccess })
    const transfer = useMutation({ mutationFn: transferAccounts, onSuccess })

    const submit = (payload) => {
        console.log(payload);

        switch (payload.type) {
            case 'income':
                return income.mutateAsync(payload)
            case 'expense':
                return expense.mutateAsync(payload)
            case 'transfer':
                return transfer.mutateAsync(payload)
            default:
                return Promise.reject(new Error('不明な取引の種類です。'))
        }
    }

    return { submit, isPending: income.isPending || expense.isPending || transfer.isPending }

}