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
    const { email, password } = (await request.json()) as any

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
    const stored = localStorage.getItem('delivery-men')
    if (stored) {
      return HttpResponse.json(JSON.parse(stored))
    }
    return HttpResponse.json(deliveryMenData)
  }),

  http.post('http://localhost:3333/delivery-men', async ({ request }) => {
    const { name, phone } = (await request.json()) as any

    let currentData = deliveryMenData
    const stored = localStorage.getItem('delivery-men')
    if (stored) {
      currentData = JSON.parse(stored)
    }

    const newDeliveryMan = {
      id: `delivery-man-${Date.now()}`,
      name,
      phone,
      status: 'active',
      imageUrl: `https://via.placeholder.com/150/2196F3/FFFFFF?Text=${encodeURIComponent(name)}`
    }

    const updatedData = {
      deliveryMen: [...currentData.deliveryMen, newDeliveryMan]
    }

    localStorage.setItem('delivery-men', JSON.stringify(updatedData))

    return HttpResponse.json(newDeliveryMan)
  }),

  http.put('http://localhost:3333/delivery-men/:id', async ({ request, params }) => {
    const { id } = params
    const { name, phone } = (await request.json()) as any

    let currentData = deliveryMenData
    const stored = localStorage.getItem('delivery-men')
    if (stored) {
      currentData = JSON.parse(stored)
    }

    const deliveryManIndex = currentData.deliveryMen.findIndex(
      (d) => d.id === id,
    )

    if (deliveryManIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedDeliveryMan = {
      ...currentData.deliveryMen[deliveryManIndex],
      name,
      phone,
    }

    currentData.deliveryMen[deliveryManIndex] = updatedDeliveryMan

    localStorage.setItem('delivery-men', JSON.stringify(currentData))

    return HttpResponse.json(updatedDeliveryMan)
  }),

  http.delete('http://localhost:3333/delivery-men/:id', async ({ params }) => {
    const { id } = params

    let currentData = deliveryMenData
    const stored = localStorage.getItem('delivery-men')
    if (stored) {
      currentData = JSON.parse(stored)
    }

    const deliveryManIndex = currentData.deliveryMen.findIndex(
      (d) => d.id === id,
    )

    if (deliveryManIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    currentData.deliveryMen.splice(deliveryManIndex, 1)

    localStorage.setItem('delivery-men', JSON.stringify(currentData))

    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('http://localhost:3333/delivery-men/:id/status', async ({ request, params }) => {
    const { id } = params
    const { status } = (await request.json()) as any

    let currentData = deliveryMenData
    const stored = localStorage.getItem('delivery-men')
    if (stored) {
      currentData = JSON.parse(stored)
    }

    const deliveryManIndex = currentData.deliveryMen.findIndex(
      (d) => d.id === id,
    )

    if (deliveryManIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedDeliveryMan = {
      ...currentData.deliveryMen[deliveryManIndex],
      status,
    }

    currentData.deliveryMen[deliveryManIndex] = updatedDeliveryMan

    localStorage.setItem('delivery-men', JSON.stringify(currentData))

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
      const { deliveryManId } = (await request.json()) as any

      const orderIndex = ordersData.orders.findIndex((o) => o.orderId === orderId)
      if (orderIndex === -1) {
        return new HttpResponse(null, { status: 404 })
      }

      let currentDeliveryMenData = deliveryMenData
      const stored = localStorage.getItem('delivery-men')
      if (stored) {
        currentDeliveryMenData = JSON.parse(stored)
      }

      const deliveryMan = currentDeliveryMenData.deliveryMen.find(
        (d) => d.id === deliveryManId,
      )
      if (!deliveryMan) {
        return new HttpResponse(null, { status: 404 })
      }

      ; (ordersData.orders[orderIndex] as any).deliveryMan = deliveryMan

      return new HttpResponse(null, { status: 204 })
    },
  ),
]
