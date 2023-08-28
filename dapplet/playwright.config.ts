import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { BrowserOptions, DappletExecutor, RegistryTypes } from '@dapplets/dapplet-playwright';

dotenv.config();

export default defineConfig<BrowserOptions & DappletExecutor.DappletExecutorOptions>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'line',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        newHeadless: process.env.CI ? true : false,
        extensionVersion: 'latest',
        registry:
          process.env.GIT_BRANCH_NAME === 'develop' || process.env.GIT_BRANCH_NAME === 'testing'
            ? RegistryTypes.Test
            : RegistryTypes.Prod,
        devServerUrl: 'http://localhost:3001/dapplet.json',
        dappletName: 'tipping-near-dapplet',
      },
    },
  ],
  webServer: {
    command: 'npm run start',
    port: 3001,
    reuseExistingServer: !process.env.CI,
  },
});
