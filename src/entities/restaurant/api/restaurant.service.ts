// src/core/services/restaurant.service.ts
import { apiClient } from '@/shared/api/apiClient'
import {
  type RegisterRestaurantParams,
  type Restaurant,
  type UpdateRestaurantProfileParams,
} from '@/entities/restaurant/model/restaurant.model'

export const getManagedRestaurant = async (): Promise<Restaurant> => {
  const response = await apiClient.get('/managed-restaurant')
  return response.data
}

export const updateRestaurantProfile = async (
  params: UpdateRestaurantProfileParams,
): Promise<void> => {
  await apiClient.put('/profile', params)
}

export const registerRestaurant = async (
  params: RegisterRestaurantParams,
): Promise<void> => {
  await apiClient.post('/restaurants', params)
}
