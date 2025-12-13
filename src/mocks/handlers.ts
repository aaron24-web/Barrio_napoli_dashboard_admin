import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock for "Forgot Password"
  http.post('*/password/forgot', async () => {
    // Simulate a successful response
    return new HttpResponse(null, {
      status: 204, // No Content
    })
  }),

  // Mock for "Reset Password"
  http.post('*/password/reset', async () => {
    // Simulate a successful response
    return new HttpResponse(null, {
      status: 204, // No Content
    })
  }),
]
