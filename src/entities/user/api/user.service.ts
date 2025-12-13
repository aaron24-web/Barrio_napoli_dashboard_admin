// src/core/services/user.service.ts
import { apiClient } from '@/shared/api/apiClient'
import {
  type UpdateProfileParams,
  type User,
} from '@/entities/user/model/user.model'

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get('/me')
  return response.data
}

export const updateProfile = async (params: UpdateProfileParams): Promise<void> => {
  await apiClient.put('/profile', params)
}
