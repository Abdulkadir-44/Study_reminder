import { post } from "./request"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = (data) => post(`${BASE_URL}/auth/login`, data);
