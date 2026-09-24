// api/auth.ts
import { boolean } from 'zod';
import { apiClient } from './client';
import { AuthResponse, LoginPayload, SignupPayload, User } from '@aio/shared';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
    try {
        const { data: response } = await apiClient.post('/auth/login', payload);
        if (response?.statusCode === 201 || response?.access_token) {
            const { message, user, access_token: accessToken } = response;
            return { isAuthorized: true, message, user, accessToken };
        }
        return {
            isAuthorized: false,
            message: response?.message || 'Login failed',
            user: null,
            accessToken: null,
        };
    } catch (error: any) {
        return {
            isAuthorized: false,
            message: error?.message || 'Unknown error',
            user: null,
            accessToken: null,
        };
    }
}

export async function signupApi(payload: SignupPayload): Promise<AuthResponse> {
    try {
        const { data: response } = await apiClient.post('/auth/sign-up', payload);
        if (response?.statusCode === 201 || response?.access_token) {
            const { message, user, access_token: accessToken } = response;
            return { isAuthorized: true, message, user, accessToken };
        }
        return {
            isAuthorized: false,
            message: response?.message || 'Sign up failed',
            user: null,
            accessToken: null,
        };
    } catch (error: any) {
        return {
            isAuthorized: false,
            message: error?.message || 'Unknown error',
            user: null,
            accessToken: null,
        };
    }
}

export async function refreshAccessTokenApi(): Promise<AuthResponse> {
    try {
        const { data: response } = await apiClient.post('/auth/refresh', {});
        return {
            accessToken: response?.access_token ?? null,
            user: response?.user ?? null,
            isAuthorized: true,
            message: response?.message || 'Refresh token success',
        };
    } catch (error: any) {
        return {
            isAuthorized: false,
            message: error?.message || 'Refresh token failed',
            user: null,
            accessToken: null,
        };
    }
}

export async function logoutApi(): Promise<void> {
    await apiClient.post('/auth/logout', {});
}

export async function getMeApi(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/profile');
    return data;
}