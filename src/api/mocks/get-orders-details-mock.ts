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
    totalInCents: 7900,
    orderItems: [
      {
        id: `order-item-${params.orderId}-1`,
        priceInCents: 2500,
        product: {
          name: 'Pizza Margherita',
          description: 'extra queso, masa delgada',
          notes: null,
        },
        quantity: 2,
      },
      {
        id: `order-item-${params.orderId}-2`,
        priceInCents: 1200,
        product: {
          name: 'Cuba',
          description: 'con limón',
          notes: 'poco hielo',
        },
        quantity: 1,
      },
      {
        id: `order-item-${params.orderId}-3`,
        priceInCents: 1700,
        product: {
          name: 'Pasta Alfredo con pollo',
          description: '+ pan de ajo',
          notes: null,
        },
        quantity: 1,
      },
    ],
  })
})
