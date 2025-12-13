// src/core/services/category.service.ts
import { apiClient } from '@/shared/api/apiClient'
import {
  type Category,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from '@/entities/category/model/category.model'

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories')
  return response.data
}

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const formData = new FormData()
  formData.append('name', payload.name)
  if (payload.image) {
    formData.append('image', payload.image)
  }

  const response = await apiClient.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateCategory = async (
  payload: UpdateCategoryPayload,
): Promise<Category> => {
  const formData = new FormData()
  if (payload.name) {
    formData.append('name', payload.name)
  }
  if (payload.image) {
    formData.append('image', payload.image)
  }

  const response = await apiClient.patch(
    `/categories/${payload.id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiClient.delete(`/categories/${categoryId}`)
}
