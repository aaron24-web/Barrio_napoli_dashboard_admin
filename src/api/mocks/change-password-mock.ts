import { http, HttpResponse } from 'msw'

import { ChangePasswordBody } from '../change-password'

export const changePasswordMock = http.put<never, ChangePasswordBody>(
  '/admin/password',
  async ({ request }) => {
    const { currentPassword } = await request.json()

    if (currentPassword === '123456') {
      return new HttpResponse(null, { status: 204 })
    } else {
      return new HttpResponse(null, { status: 400 })
    }
  },
)
