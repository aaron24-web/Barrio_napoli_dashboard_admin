import { http, HttpResponse, passthrough } from 'msw'

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

  http.put('/delivery-men/:id', async ({ request, params }) => {
    const { id } = params
    const { name, phone } = await request.json()
    const deliveryManIndex = deliveryMenData.deliveryMen.findIndex(
      (d) => d.id === id,
    )

    if (deliveryManIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedDeliveryMan = {
      ...deliveryMenData.deliveryMen[deliveryManIndex],
      name,
      phone,
    }

    deliveryMenData.deliveryMen[deliveryManIndex] = updatedDeliveryMan

    return HttpResponse.json(updatedDeliveryMan)
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

  http.patch(
    'http://localhost:3333/orders/:orderId/assign-delivery-man',
    async ({ request, params }) => {
      const { orderId } = params
      const { deliveryManId } = await request.json()

      const orderIndex = ordersData.orders.findIndex((o) => o.orderId === orderId)
      if (orderIndex === -1) {
        return new HttpResponse(null, { status: 404 })
      }

      const deliveryMan = deliveryMenData.deliveryMen.find(
        (d) => d.id === deliveryManId,
      )
      if (!deliveryMan) {
        return new HttpResponse(null, { status: 404 })
      }

      ordersData.orders[orderIndex].deliveryMan = deliveryMan

      return new HttpResponse(null, { status: 204 })
    },
  ),
]
