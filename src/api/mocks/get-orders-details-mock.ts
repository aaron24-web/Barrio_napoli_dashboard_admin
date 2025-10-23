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
  if (params.orderId === 'order-1') {
    return HttpResponse.json({
      id: params.orderId,
      customer: {
        name: 'Aaron Tun',
        email: 'aaron.tun@example.com',
        phone: '9998887766',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalInCents: 16000,
      orderItems: [
        {
          id: 'order-item-1',
          priceInCents: 15000,
          product: {
            name: 'Pizza Napolitana',
          },
          quantity: 1,
        },
        {
          id: 'order-item-2',
          priceInCents: 1000,
          product: {
            name: 'Queso Extra',
          },
          quantity: 1,
        },
      ],
    })
  }

  return HttpResponse.json({
    id: params.orderId,
    customer: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123124125115',
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalInCents: 5000,
    orderItems: [
      {
        id: 'order-item-1',
        priceInCents: 1000,
        product: {
          name: 'Pizza Pepperoni',
        },
        quantity: 1,
      },
      {
        id: 'order-item-2',
        priceInCents: 2000,
        product: {
          name: 'Pizza Marguerita',
        },
        quantity: 2,
      },
    ],
  })
})
