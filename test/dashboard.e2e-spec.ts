import { expect, test } from '@playwright/test'

test('mostrar métrica de pedidos por día', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('20', { exact: true })).toBeVisible()
  await expect(page.getByText('-5% en relación a ayer')).toBeVisible()
})

test('mostrar métrica de pedidos por mes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('200', { exact: true })).toBeVisible()
  await expect(page.getByText('+7% en relación al mes pasado')).toBeVisible()
})

test('mostrar métrica de pedidos cancelados por mes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('5', { exact: true })).toBeVisible()
  await expect(page.getByText('-5% en relación al mes pasado')).toBeVisible()
})

test('mostrar métrica de ingresos por mes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('R$ 200,00')).toBeVisible()
  await expect(page.getByText('+10% en relación al mes pasado')).toBeVisible()
})
