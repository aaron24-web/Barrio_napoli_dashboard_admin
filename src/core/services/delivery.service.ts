// src/core/services/delivery.service.ts
import { apiClient } from '@/core/api/apiClient'
import {
  AssignDeliveryManParams,
  CreateDeliveryManPayload,
  DeliveryMan,
  GetDeliveryMenResponse,
} from '@/core/models/delivery.model'

export const getDeliveryMen = async (): Promise<GetDeliveryMenResponse> => {
  const response = await apiClient.get('/delivery-men')
  return response.data
}

export const createDeliveryMan = async (
  payload: CreateDeliveryManPayload,
): Promise<DeliveryMan> => {
  const response = await apiClient.post('/delivery-men', payload)
  return response.data
}

export const updateDeliveryMan = async (
  id: string,
  payload: CreateDeliveryManPayload,
): Promise<DeliveryMan> => {
  const response = await apiClient.put(`/delivery-men/${id}`, payload)
  return response.data
}

export const deleteDeliveryMan = async (id: string): Promise<void> => {
  await apiClient.delete(`/delivery-men/${id}`)
}

export const toggleDeliveryManStatus = async (
  id: string,
  status: 'active' | 'inactive',
): Promise<DeliveryMan> => {
  const response = await apiClient.patch(`/delivery-men/${id}/status`, {
    status,
  })
  return response.data
}

export const assignDeliveryMan = async (
  params: AssignDeliveryManParams,
): Promise<void> => {
  await apiClient.patch(`/orders/${params.orderId}/assign-delivery-man`, {
    deliveryManId: params.deliveryManId,
  })
}
