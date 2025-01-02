import { post } from "./request"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = (data) => post(`${BASE_URL}/auth/register`, data);