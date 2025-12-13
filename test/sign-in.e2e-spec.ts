import { expect, test } from '@playwright/test'

test('iniciar sesión exitosamente', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page.getByLabel('Tu correo electrónico').fill('johndoe@example.com')
  await page.getByLabel('Tu contraseña').fill('123456')
  await page.getByRole('button', { name: 'Acceder al panel' }).click()

  const toast = page.getByText('Credenciales inválidas.')

  expect(toast).toBeVisible()
})

test('iniciar sesión con credenciales incorrectas', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page.getByLabel('Tu correo electrónico').fill('wrong@example.com')
  await page.getByLabel('Tu contraseña').fill('123456')
  await page.getByRole('button', { name: 'Acceder al panel' }).click()

  const toast = page.getByText('Credenciales inválidas.')

  expect(toast).toBeVisible()
})

test('navegar a la página de nuevo establecimiento', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Nuevo establecimiento' }).click()

  expect(page.url()).toContain('/sign-up')
})
