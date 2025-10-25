import { api } from '@/lib/axios'

export interface GetDeliveryMenResponse {
  deliveryMen: {
    id: string
    name: string
  }[]
}

export async function getDeliveryMen() {
  const response = await api.get<GetDeliveryMenResponse>('/delivery-men')

  return response.data
}
