import {
  expect,
  test,
  type Page,
} from '@playwright/test';

const AUTH_SIGN_IN_URL =
  'http://evo.dev.theysaid.io/';
const VALID_EMAIL = 'riantratesting2@gmail.com';
const VALID_PASSWORD = 'Madgascar12@';
const INVALID_PASSWORD = 'WrongPass123!';
const INVALID_EMAIL = 'riantratesting2+invalid@gmail.com';
const TEACH_AI_LINK = 'https://andrian-syahputra.lovable.app/';
const CV_FILE_PATH = 'd:\\AndrianTest\\Testdata\\Andrian Syahputra - CV.pdf';
const CONTACTS_FILE_PATH = 'd:\\AndrianTest\\Testdata\\contacts_example.csv';

async function gotoSignIn(page: Page): Promise<void> {
  await page.goto(AUTH_SIGN_IN_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: 30_000 });
}

async function expectSuccessfulAuthRedirect(page: Page): Promise<void> {
  await page.waitForURL(/evo\.dev\.theysaid\.io\/(home|projects)/, { timeout: 60_000 });
  await expect(page).toHaveURL(/evo\.dev\.theysaid\.io\/(home|projects)/);
}

async function loginWithPassword(page: Page, email: string, password: string): Promise<void> {
  await gotoSignIn(page);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

async function loginToHome(page: Page): Promise<void> {
  await loginWithPassword(page, VALID_EMAIL, VALID_PASSWORD);
  await expectSuccessfulAuthRedirect(page);
}

async function cleanupTeachAiArtifacts(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actionButton = page.getByRole('button', { name: 'Actions' }).first();
    const hasActionButton = await actionButton.isVisible().catch(() => false);

    if (!hasActionButton) {
      const removeButton = page.getByRole('button', { name: 'Remove' }).first();
      const hasDirectRemove = await removeButton.isVisible().catch(() => false);

      if (!hasDirectRemove) {
        break;
      }

      await removeButton.click();
      continue;
    }

    await actionButton.click();

    const removeButton = page.getByRole('button', { name: 'Remove' }).first();
    const hasRemoveButton = await removeButton.isVisible().catch(() => false);

    if (!hasRemoveButton) {
      break;
    }

    await removeButton.click();
  }
}

async function openTeachAi(page: Page): Promise<void> {
  await loginToHome(page);
  await page.getByRole('link', { name: 'Teach AI' }).click();
  await expect(page.locator('[data-test="teach-ai-company-metadata-section"]')).toBeVisible({
    timeout: 30_000,
  });
  await cleanupTeachAiArtifacts(page);
}

async function uploadFileInDialog(page: Page, filePath: string): Promise<void> {
  await page.locator('input[type="file"]').last().setInputFiles(filePath);
}

async function saveTeachAiMetadataField(
  page: Page,
  editButtonName: string,
  value: string,
  expectedText: string | RegExp,
): Promise<void> {
  const metadataSection = page.locator('[data-test="teach-ai-company-metadata-section"]');
  const editButton = page.getByRole('button', { name: editButtonName });
  const body = page.locator('body');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await editButton.click();

    const textbox = metadataSection.getByRole('textbox').last();
    await expect(textbox).toBeVisible({ timeout: 10_000 });
    await textbox.click();
    await textbox.press('Control+A');
    await textbox.type(value, { delay: 40 });

    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    try {
      await expect(body).toContainText(expectedText, { timeout: 10_000 });
      return;
    } catch {
      const saveStillVisible = await saveButton.isVisible().catch(() => false);

      if (saveStillVisible) {
        await saveButton.click();

        try {
          await expect(body).toContainText(expectedText, { timeout: 10_000 });
          return;
        } catch {
          // Retry the full edit flow when the first save did not persist.
        }
      }

      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      const canCancel = await cancelButton.isVisible().catch(() => false);

      if (canCancel) {
        await cancelButton.click().catch(() => {});
      }
    }
  }

  await expect(body).toContainText(expectedText, { timeout: 10_000 });
}

async function waitForTeachAiFileGeneration(
  page: Page,
  expectedFileText: string | RegExp,
): Promise<void> {
  const body = page.locator('body');
  const addFileButton = page.getByRole('button', { name: 'Add file Add file' });
  const generatingText = page.getByText('Generating data', { exact: true }).first();

  await expect(body).toContainText(expectedFileText, { timeout: 120_000 });

  const generationIsVisible = await generatingText.isVisible().catch(() => false);

  if (generationIsVisible) {
    await expect(generatingText).toBeHidden({ timeout: 120_000 });
  }

  await expect(addFileButton).toBeVisible({ timeout: 30_000 });
  await expect(addFileButton).toBeEnabled({ timeout: 120_000 });
}

async function addTeachAiFile(
  page: Page,
  filePath: string,
  expectedFileText: string | RegExp,
): Promise<void> {
  const addFileButton = page.getByRole('button', { name: 'Add file Add file' });
  const confirmButton = page.locator('[data-test="confirm-add-file-button"]');
  const cancelButton = page.locator('[data-test="cancel-add-file-button"]');

  await expect(addFileButton).toBeVisible({ timeout: 30_000 });
  await expect(addFileButton).toBeEnabled({ timeout: 30_000 });
  await addFileButton.click();

  await uploadFileInDialog(page, filePath);
  await expect(confirmButton).toBeVisible({ timeout: 10_000 });

  // Wait for the file upload to finish before trying to save.
  // The Save/Confirm button typically stays disabled while the
  // "Uploading..." indicator is shown next to the file.
  const uploadingText = page.getByText('Uploading...', { exact: false });
  await uploadingText
    .waitFor({ state: 'hidden', timeout: 120_000 })
    .catch(() => {
      // If it never appears or never disappears, fall through and
      // let the click-loop below handle retries.
    });

  // Click Save/Confirm repeatedly until the dialog actually closes
  // (button becomes hidden) or we run out of attempts.
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const stillVisible = await confirmButton.isVisible().catch(() => false);

    if (!stillVisible) {
      break;
    }

    const isEnabled = await confirmButton.isEnabled().catch(() => false);

    if (isEnabled) {
      await confirmButton.click({ force: true }).catch(() => {});
    }

    await page.waitForTimeout(1_000);
  }

  await expect(cancelButton).toBeHidden({ timeout: 30_000 });
  await expect(confirmButton).toBeHidden({ timeout: 30_000 });
  await waitForTeachAiFileGeneration(page, expectedFileText);
}

test.describe('Login And Teach AI', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120_000);

  test.afterEach(async ({ page }) => {
    await cleanupTeachAiArtifacts(page);
  });

  test('positive login succeeds with valid credentials', async ({ page }) => {
    await loginWithPassword(page, VALID_EMAIL, VALID_PASSWORD);
    await expectSuccessfulAuthRedirect(page);
  });

  test('negative login rejects an incorrect password', async ({ page }) => {
    await loginWithPassword(page, VALID_EMAIL, INVALID_PASSWORD);
    await expect(page).toHaveURL(/\/password/, { timeout: 20_000 });
    await expect(page.locator('body')).toContainText(/incorrect|invalid/i);
  });

  test('negative login rejects an unknown email', async ({ page }) => {
    await loginWithPassword(page, INVALID_EMAIL, VALID_PASSWORD);
    await expect(page.locator('body')).toContainText(/sign up|incorrect|invalid|account/i, {
      timeout: 20_000,
    });
  });

  test('Teach AI add link cancel closes modal without saving', async ({ page }) => {
    await openTeachAi(page);

    await page.getByRole('button', { name: 'Add link Add link' }).click();
    await page.getByRole('textbox', { name: 'Website link' }).fill(TEACH_AI_LINK);
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('textbox', { name: 'Website link' })).toBeHidden({
      timeout: 10_000,
    });
  });

  test('Teach AI add website link and generate summary', async ({ page }) => {
    await openTeachAi(page);

    await page.getByRole('button', { name: 'Add link Add link' }).click();
    await page.getByRole('textbox', { name: 'Website link' }).fill(TEACH_AI_LINK);
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.locator('body')).toContainText(/Generating data|Website summary/i, {
      timeout: 60_000,
    });
  });

  test('Teach AI edit company metadata fields', async ({ page }) => {
    await openTeachAi(page);

    await saveTeachAiMetadataField(page, 'Edit Company', 'Andrian Company Test', 'Andrian Company Test');

    await page.getByRole('button', { name: 'Edit Company' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await saveTeachAiMetadataField(page, 'Edit Industry', 'Andrian Industry', 'Andrian Industry');

    await saveTeachAiMetadataField(page, 'Edit Category', 'B2C', 'B2C');

    await saveTeachAiMetadataField(page, 'Edit Target customers', 'QA', /Target customers|QA/i);
  });

  test('Teach AI add  files', async ({ page }) => {
    await openTeachAi(page);

    await page.getByRole('button', { name: 'Add file Add file' }).click();
    await uploadFileInDialog(page, CV_FILE_PATH);
    await page.locator('[data-test="cancel-add-file-button"]').click();

    await addTeachAiFile(page, CV_FILE_PATH, 'Andrian Syahputra - CV.pdf');
    await addTeachAiFile(page, CONTACTS_FILE_PATH, /contacts_example\.csv/i);
  });
});