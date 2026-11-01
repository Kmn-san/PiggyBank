import { axiosInstance } from "./axios.js"

export const loginUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/login`, { user_code: userCode, password })
    return response.data
}

export const registerUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/register`, { user_code: userCode, password })
    return response.data
}

export const logoutUser = async (refreshToken) => {
    const response = await axiosInstance.post(`/auth/logout`, { refreshToken })
    return response.data
}

export const fetchDashboard = async () => {
    const response = await axiosInstance.get(`/dashboard`)
    return response.data.data
}

export const fetchSavings = async () => {
    const response = await axiosInstance.get(`/savings`)
    return response.data.data
}

export const fetchExpenses = async (month) => {
    const response = await axiosInstance.get('/expenses', { params: { month } })
    return response.data.result
}

export const fetchTransactions = async (month) => {
    const response = await axiosInstance.get('/transactions', { params: { month } })
    return response.data.data
}

export const createGoal = async (name) => {
    const response = await axiosInstance.post('/savings/createGoal', name)
    return response.data.data
}

export const transferIncome = async ({ amount, transactionDate, note }) => {
    const response = await axiosInstance.post(`/transactions/income`, { amount, transactionDate, note })
    return response.data.result
}

export const transferExpenses = async ({ amount, category, note, transactionDate }) => {
    const response = await axiosInstance.post(`/expenses`, { amount, category, note, transactionDate })
    return response.data.data
}

export const transferAccounts = async ({ amount, fromAccount, toAccount, note, transactionDate }) => {
    const response = await axiosInstance.post(`/transactions/transfer`, { amount, fromAccount, toAccount, note, transactionDate })
    return response.data.data
}