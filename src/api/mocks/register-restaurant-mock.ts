import { http, HttpResponse } from 'msw'

import { registerRestaurantInBody } from '../register-restaurant'

export const registerRestaurantMock = http.post<
  never,
  registerRestaurantInBody
>('/restaurants', async () => {
  return new HttpResponse(null, {
    status: 200,
  })
})
