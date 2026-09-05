import { test, expect } from '@playwright/test';
import { openApp } from './helpers';
import { loginButton, signUpButton } from './locators';

test('Log in and Sign Up route to /login and /register in the same tab', async ({ page }) => {
  await openApp(page);
  await loginButton(page).click();
  await expect(page).toHaveURL(/\/login$/);

  await openApp(page);
  await signUpButton(page).click();
  await expect(page).toHaveURL(/\/register$/);
});
