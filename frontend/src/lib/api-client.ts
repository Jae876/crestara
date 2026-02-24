import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use relative /api paths - Next.js middleware will proxy to backend
const BASE_URL = '/api';

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle token refresh on 401
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          if (!refreshToken) throw new Error('No refresh token');

          const response = await axios.post(`/api/auth/refresh`, {
            refreshToken,
          });

          useAuthStore.getState().setAuth(response.data);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return client(originalRequest);
        } catch (err) {
          useAuthStore.getState().logout();
          window.location.href = '/auth/login';
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
