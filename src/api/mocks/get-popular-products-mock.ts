import { http, HttpResponse } from 'msw'

import { GetPopularProductsResponse } from '../get-popular-products'

export const getPopularProductsMock = http.get<never, never, GetPopularProductsResponse>(
  '/metrics/popular-products',
  () => {
    return HttpResponse.json([
      { product: 'Margherita', amount: 120 },
      { product: 'Pepperoni', amount: 90 },
      { product: 'Funghi', amount: 80 },
      { product: 'Quattro Formaggi', amount: 110 },
      { product: 'Capricciosa', amount: 70 },
    ])
  },
)