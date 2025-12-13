// src/core/services/auth.service.ts
import { apiClient } from '@/shared/api/apiClient'
import {
  type ChangePasswordParams,
  type SignInParams,
} from '@/features/auth/model/auth.model'

export const signIn = async (params: SignInParams): Promise<void> => {
  await apiClient.post('/sessions', params)
}

export const signOut = async (): Promise<void> => {
  await apiClient.post('/sign-out')
}

export const changePassword = async (
  params: ChangePasswordParams,
): Promise<void> => {
  await apiClient.patch('/users/password', params)
}
