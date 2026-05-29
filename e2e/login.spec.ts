import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('Login mit Admin-Credentials erfolgreich', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByPlaceholder('name@beispiel.ch')).toBeVisible()

    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')

    await page.waitForURL('/')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('Login mit falschem Passwort zeigt Fehler', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'falsches-passwort')
    await page.click('button[type="submit"]')

    await expect(
      page.locator('[role="alert"]').or(page.locator('.text-destructive'))
    ).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('Nicht angemeldete Nutzer werden auf /login umgeleitet', async ({ page }) => {
    await page.goto('/antraege')
    await expect(page).toHaveURL('/login')
  })
})
