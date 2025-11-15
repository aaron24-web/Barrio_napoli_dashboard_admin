export interface DeliveryMan {
  id: string
  name: string
  phone: string
  status: 'active' | 'inactive'
}

export interface CreateDeliveryManPayload {
  name: string
  phone: string
}

export interface GetDeliveryMenResponse {
  deliveryMen: DeliveryMan[]
}

export interface AssignDeliveryManParams {
  orderId: string
  deliveryManId: string
}

export interface DeliveryPerson {
  id: string
  name: string
  vehicle: string
  orderId: string
  address: string
}
