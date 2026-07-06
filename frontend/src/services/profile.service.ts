import { api } from '../api/axios';
import type { ApiResponse } from '../features/auth/types/auth.types';

export interface UserPreferences {
  id: string;
  userId: string;
  preferredName: string | null;
  profileImage: string | null;
  phone: string | null;
  occupation: string | null;
  country: string | null;
  timezone: string | null;
  currency: string;
  language: string;
  monthlyIncome: number | null;
  incomeFrequency: string;
  financialExperience: string | null;
  riskTolerance: string;
  budgetMethod: string;
  monthlySavingsGoal: number | null;
  preferredGoal: string | null;
  notificationPreference: any;
  monthlyReportEnabled: boolean;
  monthlyReportEmail: string | null;
  reportDeliveryDate: number;
  reportDeliveryTime: string;
  aiResponseStyle: string;
  aiResponseLength: string;
  aiCoachingStyle: string;
  theme: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  provider: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface ActivityLog {
  id: string;
  time: string;
  action: string;
  module: string;
  status: string;
}

export interface ReportSettings {
  monthlyReportEnabled: boolean;
  monthlyReportEmail: string | null;
  reportDeliveryDate: number;
  reportDeliveryTime: string;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ApiResponse<UserProfile>>('/profile');
    return response.data.data;
  },

  updateProfile: async (data: any): Promise<UserProfile> => {
    const response = await api.put<ApiResponse<UserProfile>>('/profile', data);
    return response.data.data;
  },

  getPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get<ApiResponse<UserPreferences>>('/profile/preferences');
    return response.data.data;
  },

  updatePreferences: async (data: any): Promise<UserPreferences> => {
    const response = await api.put<ApiResponse<UserPreferences>>('/profile/preferences', data);
    return response.data.data;
  },

  uploadAvatar: async (profileImage: string): Promise<{ profileImage: string }> => {
    const response = await api.post<ApiResponse<{ profileImage: string }>>('/profile/avatar', { profileImage });
    return response.data.data;
  },

  getActivityLogs: async (): Promise<ActivityLog[]> => {
    const response = await api.get<ApiResponse<ActivityLog[]>>('/profile/activity');
    return response.data.data;
  },

  getReportSettings: async (): Promise<ReportSettings> => {
    const response = await api.get<ApiResponse<ReportSettings>>('/profile/report-settings');
    return response.data.data;
  },

  updateReportSettings: async (data: any): Promise<ReportSettings> => {
    const response = await api.put<ApiResponse<ReportSettings>>('/profile/report-settings', data);
    return response.data.data;
  },
};
export default profileService;
