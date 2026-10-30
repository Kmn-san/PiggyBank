import { useMutation } from '@tanstack/react-query'
import { transferAccounts } from '../lib/api.js'

const errorState = (error) => Alert.alert('Error', error.response?.data?.message ?? 'Something went wrong. Please try again.', [
    { text: "OK", style: "cancel" }
])

const successState = (data) => Alert.alert('Success', data?.message ?? 'Done!', [
    { text: "OK", style: "cancel" }
])

function useTrasfer() {
    const transferAccountsMutation = useMutation({
        mutationFn: (amount, fromAccount, toAccount) => transferAccounts(amount, fromAccount, toAccount),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            successState(data)
        },
        onError: (error) => errorState(error)
    })

    return {
        transferAccounts: transferAccountsMutation
    }
}

export default useTrasfer