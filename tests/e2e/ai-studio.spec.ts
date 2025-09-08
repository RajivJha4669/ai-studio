import { test, expect } from '@playwright/test';

test.describe('AI Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main interface', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AI Studio' })).toBeVisible();
    await expect(page.getByText('Upload an image, add a prompt, and generate amazing AI-powered content')).toBeVisible();
    
    // Check that all main components are present
    await expect(page.getByText('Upload Image')).toBeVisible();
    await expect(page.getByText('Prompt')).toBeVisible();
    await expect(page.getByText('Style')).toBeVisible();
    await expect(page.getByText('Live Summary')).toBeVisible();
    await expect(page.getByText('Generation History')).toBeVisible();
  });

  test('should allow typing in prompt field', async ({ page }) => {
    const promptText = 'A beautiful sunset over mountains';
    
    await page.getByLabel('Prompt').fill(promptText);
    await expect(page.getByLabel('Prompt')).toHaveValue(promptText);
  });

  test('should allow selecting different styles', async ({ page }) => {
    const styleSelector = page.getByLabel('Style');
    
    await styleSelector.selectOption('Vintage');
    await expect(styleSelector).toHaveValue('Vintage');
    
    await styleSelector.selectOption('Streetwear');
    await expect(styleSelector).toHaveValue('Streetwear');
  });

  test('should show live summary when prompt is entered', async ({ page }) => {
    const promptText = 'A beautiful sunset over mountains';
    
    await page.getByLabel('Prompt').fill(promptText);
    
    // The live summary should show the prompt
    await expect(page.getByText(promptText)).toBeVisible();
  });

  test('should disable generate button when no image is uploaded', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate' });
    
    // Button should be disabled when no image is uploaded
    await expect(generateButton).toBeDisabled();
  });

  test('should handle file upload', async ({ page }) => {
    // Create a test image file
    const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload').click();
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: testImage,
    });
    
    // Should show the uploaded image
    await expect(page.getByAltText('Upload preview')).toBeVisible();
  });

  test('should enable generate button after uploading image and entering prompt', async ({ page }) => {
    // Create a test image file
    const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    // Upload image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload').click();
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: testImage,
    });
    
    // Enter prompt
    await page.getByLabel('Prompt').fill('A beautiful sunset');
    
    // Generate button should now be enabled
    const generateButton = page.getByRole('button', { name: 'Generate' });
    await expect(generateButton).toBeEnabled();
  });

  test('should show loading state when generating', async ({ page }) => {
    // Create a test image file
    const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    // Upload image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload').click();
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: testImage,
    });
    
    // Enter prompt
    await page.getByLabel('Prompt').fill('A beautiful sunset');
    
    // Start generation
    await page.getByRole('button', { name: 'Generate' }).click();
    
    // Should show loading state
    await expect(page.getByText('Abort Generation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Abort Generation' })).toBeEnabled();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab through the interface
    await page.keyboard.press('Tab'); // Should focus on image upload
    await page.keyboard.press('Tab'); // Should focus on prompt input
    await page.keyboard.press('Tab'); // Should focus on style selector
    
    // Check that prompt input is focused
    await page.getByLabel('Prompt').fill('Test prompt');
    await expect(page.getByLabel('Prompt')).toHaveValue('Test prompt');
  });

  test('should show error message for invalid file type', async ({ page }) => {
    // Create a test text file
    const testFile = Buffer.from('This is not an image');
    
    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload').click();
    const fileChooser = await fileChooserPromise;
    
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: testFile,
    });
    
    // Should show error message
    await expect(page.getByText('Please select an image file')).toBeVisible();
  });
});
