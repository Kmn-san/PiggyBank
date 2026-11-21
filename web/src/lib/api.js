import { axiosInstance } from "./axios.js"

export const loginUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/login`, { user_code: userCode, password })
    return response.data
}

export const fetchUser = async () => {
    const response = await axiosInstance.get(`/auth/me`)
    return response.data.userData
}

export const forgetPassword = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/forget-password`, { user_code: userCode, password })
    return response.data
}

export const registerUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/register`, { user_code: userCode, password })
    return response.data
}

export const logoutUser = async () => {
    const response = await axiosInstance.post(`/auth/logout`)
    return response.data
}

export const fetchDashboard = async (month) => {
    const response = await axiosInstance.get(`/dashboard`, { params: { month } })
    return response.data.data
}

export const fetchSavings = async () => {
    const response = await axiosInstance.get(`/savings`)
    return response.data.data
}

export const fetchTransactions = async (month) => {
    const response = await axiosInstance.get('/transactions', { params: { month } })
    return response.data.data
}

export const editTransaction = async ({ transactionId, amount, transactionDate, note }) => {
    const response = await axiosInstance.patch(`/transactions/${transactionId}`, { amount, transactionDate, note })
    return response.data.result
}

export const createGoal = async (name) => {
    const response = await axiosInstance.post('/savings/createGoal', name)
    return response.data.data
}

export const deleteGoal = async (goalId) => {
    const response = await axiosInstance.patch(`/savings/${goalId}/delete`)
    return response.data.result
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


export const fetchAdminDashboard = async (
    startDate,
    endDate,
    participantIds = []
) => {
    const response = await axiosInstance.get("/admin/dashboard", {
        params: {
            startDate,
            endDate,
            participantIds: JSON.stringify(participantIds),
        },
    })

    return response.data.data
}

export const fetchAdminParticipants = async () => {
    const response = await axiosInstance.get("/admin/participants")

    return response.data.participants
}

export const fetchUserData = async () => {
    const response = await axiosInstance.get("/auth/me")
    return response.data.userData
}

export const deleteAccount = async () => {
    const response = await axiosInstance.delete("/auth/delete")
    return response.data
}