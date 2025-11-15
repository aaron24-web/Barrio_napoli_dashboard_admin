// src/core/services/user.service.ts
import { apiClient } from '@/core/api/apiClient';
import { UpdateProfileParams, User } from '@/core/models/user.model';

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get('/me');
  return response.data;
};

export const updateProfile = async (params: UpdateProfileParams): Promise<void> => {
  await apiClient.put('/profile', params);
};
