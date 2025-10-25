import { api } from '@/lib/axios'

export interface AssignDeliveryManParams {
  orderId: string
  deliveryManId: string
}

export async function assignDeliveryMan({
  orderId,
  deliveryManId,
}: AssignDeliveryManParams) {
  await api.patch(`/orders/${orderId}/assign-delivery-man`, {
    deliveryManId,
  })
}
