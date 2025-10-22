import { http, HttpResponse } from 'msw'

import { GetManagedRestaurantResponse } from '../get-manage-restaurant'

export const getManagedRestaurantMock = http.get<
  never,
  never,
  GetManagedRestaurantResponse
>('/managed-restaurant', () => {
  return HttpResponse.json({
    id: 'custom-restaurant-id',
    name: 'Barrio Napoli',
    description: 'Custo restaurant description',
    managerId: 'custom-user-id',
    createdAt: new Date(),
    updatedAt: null,
  })
})
