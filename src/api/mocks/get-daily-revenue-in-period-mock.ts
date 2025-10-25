import { http, HttpResponse } from 'msw'

import { GetDailyRevenueInPeriodQuery } from '../get-daily-revenue-in-period'

export const getDailyRevenueInPeriodMock =
  http.get<GetDailyRevenueInPeriodQuery>(
    '/metrics/daily-revenue-in-period',
    () => {
      return HttpResponse.json([
        {
          date: '2024-07-01',
          receipt: 1200,
        },
        {
          date: '2024-07-02',
          receipt: 1500,
        },
        {
          date: '2024-07-03',
          receipt: 1000,
        },
        {
          date: '2024-07-04',
          receipt: 2000,
        },
        {
          date: '2024-07-05',
          receipt: 1800,
        },
        {
          date: '2024-07-06',
          receipt: 2500,
        },
        {
          date: '2024-07-07',
          receipt: 2200,
        },
      ])
    },
  )
