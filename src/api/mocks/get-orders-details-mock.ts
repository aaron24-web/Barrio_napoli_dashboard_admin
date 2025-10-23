import { http, HttpResponse } from 'msw'

import {
  GetOrderDetailsParams,
  GetOrderDetailsResponse,
} from '../get-order-details'

export const getOrderDetailsMock = http.get<
  GetOrderDetailsParams,
  never,
  GetOrderDetailsResponse
>('/orders/:orderId', ({ params }) => {
  return HttpResponse.json({
    id: params.orderId,
    customer: {
      name: `Customer ${params.orderId}`,
      email: `${params.orderId}@example.com`,
      phone: `99988877${Math.floor(Math.random() * 100)}`,
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalInCents: Math.floor(Math.random() * 10000) + 5000,
    orderItems: [
      {
        id: `order-item-${params.orderId}-1`,
        priceInCents: Math.floor(Math.random() * 5000) + 1000,
        product: {
          name: `Pizza ${params.orderId}`,
        },
        quantity: Math.floor(Math.random() * 3) + 1,
      },
      {
        id: `order-item-${params.orderId}-2`,
        priceInCents: Math.floor(Math.random() * 2000) + 500,
        product: {
          name: `Drink ${params.orderId}`,
        },
        quantity: Math.floor(Math.random() * 2) + 1,
      },
    ],
  })
})
