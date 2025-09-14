import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, ApiResponse } from '../types';
import { authService } from '../lib/services';
import { toast } from '../components/ui/Toast';

export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const response = await authService.updateProfile(profileData);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully!');
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Invalidate and refetch profile
      queryClient.setQueryData(['user', 'profile'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await authService.changePassword(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
};