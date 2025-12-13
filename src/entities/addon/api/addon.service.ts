// src/core/services/addon.service.ts
import { apiClient } from '@/shared/api/apiClient'
import {
  type Addon,
  type CreateAddonPayload,
  type UpdateAddonPayload,
} from '@/entities/addon/model/addon.model'

export const getAddons = async (): Promise<Addon[]> => {
  const response = await apiClient.get('/addons')
  return response.data
}

export const createAddon = async (
  payload: CreateAddonPayload,
): Promise<Addon> => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('priceInCents', payload.priceInCents.toString())
  payload.categoryIds.forEach((id) => formData.append('categoryIds[]', id))
  if (payload.image) {
    formData.append('image', payload.image)
  }

  const response = await apiClient.post('/addons', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateAddon = async (
  payload: UpdateAddonPayload,
): Promise<Addon> => {
  const formData = new FormData()
  if (payload.name) {
    formData.append('name', payload.name)
  }
  if (payload.priceInCents) {
    formData.append('priceInCents', payload.priceInCents.toString())
  }
  if (payload.categoryIds) {
    payload.categoryIds.forEach((id) => formData.append('categoryIds[]', id))
  }
  if (payload.image) {
    formData.append('image', payload.image)
  }

  const response = await apiClient.patch(`/addons/${payload.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteAddon = async (addonId: string): Promise<void> => {
  await apiClient.delete(`/addons/${addonId}`)
}

export const toggleAddonAvailability = async (
  addonId: string,
  status: boolean,
): Promise<void> => {
  await apiClient.patch(`/addons/${addonId}/toggle-availability`, { status })
}
