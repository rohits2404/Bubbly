import axios, { AxiosError } from "axios";

interface LoginResponse {
  success: boolean;
  token: string;
}

const baseURL = process.env.EXPO_PUBLIC_API_URL;
if (!baseURL) {
    throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

const api = axios.create({
    baseURL,
    timeout: 10000,
});

export const register = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>("/api/auth/register", {
            email: email.toLowerCase().trim(),
            password,
            name,
            avatar: avatar || "",
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ msg?: string }>;
        const msg =
            err.response?.data?.msg ||
            err.message ||
            "Registration failed";
        throw new Error(msg);
    }
};

export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>("/api/auth/login", {
            email: email.toLowerCase().trim(),
            password,
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ msg?: string }>;
        const msg =
            err.response?.data?.msg ||
            err.message ||
            "Login failed";
        throw new Error(msg);
    }
};