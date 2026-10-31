import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchTransactions } from '../lib/api.js'

export default function useTransactions(month) {
    return useQuery({
        queryKey: ['transactions', month],
        queryFn: () => fetchTransactions(month),
        placeholderData: keepPreviousData,
    })
}