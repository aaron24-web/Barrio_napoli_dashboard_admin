import { setupWorker } from 'msw/browser'

import { env } from '@/core/lib/env'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function enableMSW() {
  if (env.MODE !== 'development') {
    return
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
