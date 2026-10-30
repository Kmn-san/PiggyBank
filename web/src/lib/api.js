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

export const transferIncome = async () => {

}

export const transaferExpenses = async (amount, category) => {
    const response = await axiosInstance.post(`/expenses`, { amount, category })
    return response.data.data
}

export const transferAccounts = async (amount, fromAccount, toAccount) => {
    const response = await axiosInstance.post(`/savings/transfer`, { amount, fromAccount, toAccount })
    return response.data.data
}