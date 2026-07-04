import { api } from './axios';
import type { ApiResponse, AuthData, RefreshData, User } from '../features/auth/types/auth.types';
import type { LoginInput, RegisterInput } from '../features/auth/schemas/auth.schema';

export const authApi = {
  login: async (data: LoginInput): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterInput): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  refresh: async (): Promise<ApiResponse<RefreshData>> => {
    const response = await api.post<ApiResponse<RefreshData>>('/auth/refresh');
    return response.data;
  },
};
