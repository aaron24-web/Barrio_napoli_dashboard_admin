import { expect, test } from '@playwright/test'

test('registrarse exitosamente', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByLabel('Nombre del establecimiento').fill('Barrio Napoli')
  await page.getByLabel('Tu nombre').fill('John Doe')
  await page.getByLabel('Tu correo electrónico').fill('johndoe@example.com')
  await page.getByLabel('Tu teléfono móvil').fill('123812641264')
  await page.getByLabel('Tu contraseña').fill('123456')

  await page.getByRole('button', { name: 'Finalizar registro' }).click()

  const toast = page.getByText('Restaurante registrado con éxito')

  expect(toast).toBeVisible()
})

test('registrarse con error', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByLabel('Nombre del establecimiento').fill('Invalid name')
  await page.getByLabel('Tu nombre').fill('John Doe')
  await page.getByLabel('Tu correo electrónico').fill('johndoe@example.com')
  await page.getByLabel('Tu teléfono móvil').fill('123812641264')
  await page.getByLabel('Tu contraseña').fill('123456')

  await page.getByRole('button', { name: 'Finalizar registro' }).click()

  const toast = page.getByText('Error al registrar el restaurante')

  expect(toast).toBeVisible()
})

test('navegar a la página de inicio de sesión', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Iniciar sesión' }).click()

  expect(page.url()).toContain('/sign-in')
})
