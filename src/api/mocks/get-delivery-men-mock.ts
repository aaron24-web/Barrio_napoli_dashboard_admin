import { http, HttpResponse } from 'msw'

import type { GetDeliveryMenResponse } from '../get-delivery-men'

export const getDeliveryMenMock = http.get<
  never,
  never,
  GetDeliveryMenResponse
>('/delivery-men', () => {
  return HttpResponse.json({
    deliveryMen: [
      {
        id: 'delivery-man-1',
        name: 'John Doe',
      },
      {
        id: 'delivery-man-2',
        name: 'Jane Doe',
      },
      {
        id: 'delivery-man-3',
        name: 'Peter Jones',
      },
      {
        id: 'delivery-man-4',
        name: 'Mary Jane',
      },
      {
        id: 'delivery-man-5',
        name: 'Chris Redfield',
      },
    ],
  })
})
