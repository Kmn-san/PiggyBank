import { axiosInstance } from "./axios.js"

export const loginUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/login`, { user_code: userCode, password })
    return response.data
}

export const registerUser = async (userCode, password) => {
    const response = await axiosInstance.post(`/auth/register`, { user_code: userCode, password })
    return response.data
}