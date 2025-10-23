import { http, HttpResponse } from 'msw'

import { SignInBody } from '../sign-in'

export const signInMock = http.post<never, SignInBody>(
  '/authenticate',
  async () => {
    return new HttpResponse(null, {
      status: 200,
      headers: { 'Set-Cookie': 'auth=sample-jwt' },
    })
  },
)
