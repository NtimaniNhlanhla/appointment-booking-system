import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'An unexpected error occurred';
    const code = error.response?.data?.code ?? 'UNKNOWN_ERROR';
    return Promise.reject({ message, code, status: error.response?.status });
  },
);