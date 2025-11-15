import { http, HttpResponse } from 'msw'

import { Order, PaginatedOrders } from '@/core/models'

import deliveryMenData from './data/delivery-men.json'
import ordersData from './data/orders.json'
import restaurantData from './data/restaurant.json'
import userData from './data/user.json'

const mockPaginatedOrders: PaginatedOrders = {
  results: ordersData.orders as Order[],
  meta: {
    pageIndex: 0,
    perPage: 10,
    totalCount: ordersData.orders.length,
  },
}

export const handlers = [
  http.post('http://localhost:3333/sessions', async ({ request }) => {
    const { email, password } = await request.json()

    if (email === 'john.doe@example.com' && password === '123456') {
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 401 })
  }),

  http.get('http://localhost:3333/me', () => {
    return HttpResponse.json(userData)
  }),

  http.get('http://localhost:3333/managed-restaurant', () => {
    return HttpResponse.json(restaurantData)
  }),

  http.get('http://localhost:3333/orders', () => {
    return HttpResponse.json(mockPaginatedOrders)
  }),

  http.get('http://localhost:3333/delivery-men', () => {
    return HttpResponse.json(deliveryMenData)
  }),

  http.get('http://localhost:3333/orders/:orderId', ({ params }) => {
    const { orderId } = params
    const order = ordersData.orders.find((o) => o.orderId === orderId)

    if (!order) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(order)
  }),

  http.patch('http://localhost:3333/orders/:orderId/approve', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('http://localhost:3333/orders/:orderId/cancel', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('http://localhost:3333/orders/:orderId/dispatch', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('http://localhost:3333/orders/:orderId/deliver', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('http://localhost:3333/orders/:orderId/finish', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
