// api/client.ts
// import { tokenStore } from '@/features/auth/store/token.store';
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 10000,
});

// Attach auth token to every request
// apiClient.interceptors.request.use((config) => {
//     const token = tokenStore.get();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

type RefreshHandler = () => Promise<[boolean, string?]>;
let refreshTokenHandler: RefreshHandler | null = null;

export const setRefreshTokenHandler = (handler: RefreshHandler) => {
    refreshTokenHandler = handler;
};

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor: automatically catch 401 and refresh access token via registered AuthContext handler
// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         const isAuthUrl =
//             originalRequest?.url?.includes('/auth/login') ||
//             originalRequest?.url?.includes('/auth/refresh') ||
//             originalRequest?.url?.includes('/auth/sign-up');

//         if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthUrl) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then((token) => {
//                         originalRequest.headers.Authorization = `Bearer ${token}`;
//                         return apiClient(originalRequest);
//                     })
//                     .catch((err) => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 if (refreshTokenHandler) {
//                     const [success] = await refreshTokenHandler();
//                     if (success) {
//                         const newAccessToken = tokenStore.get();
//                         if (newAccessToken) {
//                             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                             processQueue(null, newAccessToken);
//                             return apiClient(originalRequest);
//                         }
//                     }
//                 }

//                 processQueue(error, null);
//                 tokenStore.clear();
//                 if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//                     window.location.href = '/login';
//                 }
//                 return Promise.reject(error);
//             } catch (refreshError) {
//                 processQueue(refreshError, null);
//                 tokenStore.clear();
//                 if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//                     window.location.href = '/login';
//                 }
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         const normalized = {
//             status: error.response?.status ?? 0,
//             message: error.response?.data?.message ?? error.message ?? 'Unknown error',
//             raw: error,
//         };

//         return Promise.reject(normalized);
//     }
// );