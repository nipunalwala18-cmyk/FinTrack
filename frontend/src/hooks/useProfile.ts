import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import type { UserProfile, UserPreferences, ActivityLog, ReportSettings } from '../services/profile.service';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, any>({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    },
  });
};

export const usePreferences = () => {
  return useQuery<UserPreferences>({
    queryKey: ['preferences'],
    queryFn: profileService.getPreferences,
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<UserPreferences, Error, any>({
    mutationFn: profileService.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Preferences updated successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update preferences';
      toast.error(msg);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<{ profileImage: string }, Error, string>({
    mutationFn: profileService.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Avatar updated successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to upload avatar';
      toast.error(msg);
    },
  });
};

export const useActivityLogs = () => {
  return useQuery<ActivityLog[]>({
    queryKey: ['profile-activity'],
    queryFn: profileService.getActivityLogs,
  });
};

export const useReportSettings = () => {
  return useQuery<ReportSettings>({
    queryKey: ['profile-reports'],
    queryFn: profileService.getReportSettings,
  });
};

export const useUpdateReportSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<ReportSettings, Error, any>({
    mutationFn: profileService.updateReportSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-reports'] });
      toast.success('Report settings updated successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update report settings';
      toast.error(msg);
    },
  });
};
