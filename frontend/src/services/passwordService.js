import {post} from "./request"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const forgotPassword = (email) => post(`${BASE_URL}/auth/forgot-password`, {email});
export const resetPassword = (token, password) => post(`${BASE_URL}/auth/reset-password/${token}`, {password});
