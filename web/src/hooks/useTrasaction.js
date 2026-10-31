import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTransactions, transferAccounts } from '../lib/api.js'

const errorState = (error) => Alert.alert('Error', error.response?.data?.message ?? 'Something went wrong. Please try again.', [
    { text: "OK", style: "cancel" }
])

const successState = (data) => Alert.alert('Success', data?.message ?? 'Done!', [
    { text: "OK", style: "cancel" }
])

function useTrasaction(month) {
    const queryClient = useQueryClient();
    const transactionQuery = useQuery({
        queryKey: ["transaction", month],
        queryFn: async () => fetchTransactions(month)
    })
    const transferAccountsMutation = useMutation({
        mutationFn: (amount, fromAccount, toAccount) => transferAccounts(amount, fromAccount, toAccount),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['transaction'] })
            successState(data)
        },
        onError: (error) => errorState(error)
    })

    return {
        data: transactionQuery.data ?? [],
        isFetching: transactionQuery.isFetching,
        isError: transactionQuery.isError,
        error: transactionQuery.error,
        transferAccounts: transferAccountsMutation
    }
}

export default useTrasaction