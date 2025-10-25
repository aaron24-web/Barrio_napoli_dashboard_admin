import { http, HttpResponse } from 'msw'

import { AssignDeliveryManParams } from '../assign-delivery-man'

export const assignDeliveryManMock = http.patch<
  AssignDeliveryManParams,
  never,
  never
>('/orders/:orderId/assign-delivery-man', async ({ params }) => {
  if (params.orderId === 'error-order-id') {
    return new HttpResponse(null, { status: 400 })
  }

  return new HttpResponse(null, { status: 204 })
})
