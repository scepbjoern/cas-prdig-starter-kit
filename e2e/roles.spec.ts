import { test, expect } from '@playwright/test'

test.describe('Rollenbasierte Sichtbarkeit', () => {
  test('Admin sieht alle Navigations-Links', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Anträge' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Personen' })).toBeVisible()
  })

  test('Applicant sieht keinen Personen-Verwaltungs-Button für Löschen', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'applicant@example.com')
    await page.fill('input[type="password"]', 'applicant123')
    await page.click('button[type="submit"]')
    await page.goto('/personen')

    await expect(page.locator('button:has-text("Löschen")')).not.toBeVisible()
  })
})
