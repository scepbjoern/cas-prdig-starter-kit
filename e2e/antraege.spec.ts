import { test, expect } from '@playwright/test'

async function loginAsApplicant(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'applicant@example.com')
  await page.fill('input[type="password"]', 'applicant123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

async function loginAsReviewer(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'reviewer@example.com')
  await page.fill('input[type="password"]', 'reviewer123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test.describe('Antrag CRUD', () => {
  test('Applicant kann neuen Antrag erstellen', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege/neu')

    await page.fill('input[name="titel"]', 'Test-Antrag E2E')
    await page.fill('textarea[name="beschreibung"]', 'Automatisch erstellt')
    await Promise.all([
      page.waitForURL(/\/antraege\/[^/]+/),
      page.click('button[type="submit"]'),
    ])

    await expect(page.locator('text=Test-Antrag E2E')).toBeVisible()
  })

  test('Reviewer sieht eingereichte Anträge', async ({ page }) => {
    await loginAsReviewer(page)
    await page.goto('/antraege')

    await expect(page.locator('text=Eingereicht').first()).toBeVisible()
  })
})
