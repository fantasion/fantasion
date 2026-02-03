#!/usr/bin/env node

/**
 * Stable screenshot script for Fantasion
 *
 * Usage:
 *   node screenshot.mjs                              # Czech homepage
 *   node screenshot.mjs /cs/prehled                  # Custom path (defaults to localhost:3000)
 *   node screenshot.mjs http://localhost:3000/cs/prehled  # Full URL
 *   node screenshot.mjs /cs my-screenshot.png        # With custom output filename
 *
 * Environment Variables (overrides args):
 *   SCREENSHOT_URL   - URL to screenshot
 *   SCREENSHOT_PATH  - Output file path
 *   SCREENSHOT_WAIT  - Wait time before screenshot in ms (default: 2000)
 *   SCREENSHOT_FULL  - Take full page screenshot (default: true)
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
let urlArg = args[0];
let pathArg = args[1];

// Build configuration
const config = {
  url: process.env.SCREENSHOT_URL || buildUrl(urlArg),
  path: process.env.SCREENSHOT_PATH || buildPath(pathArg),
  waitTime: parseInt(process.env.SCREENSHOT_WAIT || '2000', 10),
  fullPage: process.env.SCREENSHOT_FULL !== 'false',
  timeout: 30000,
  retries: 3,
};

function buildUrl(urlArg) {
  if (!urlArg) {
    return 'http://localhost:3000/cs';
  }

  // If it's a full URL, use it as-is
  if (urlArg.startsWith('http://') || urlArg.startsWith('https://')) {
    return urlArg;
  }

  // If it's a path, prepend localhost:3000
  return `http://localhost:3000${urlArg.startsWith('/') ? '' : '/'}${urlArg}`;
}

function buildPath(pathArg) {
  if (pathArg) {
    // If it ends with .png, use it as filename; otherwise use as full path
    return pathArg.endsWith('.png') ? `${__dirname}/${pathArg}` : resolve(pathArg);
  }

  // Default: timestamp-based filename
  return `${__dirname}/screenshot-${Date.now()}.png`;
}

async function takeScreenshot() {
  let browser;

  try {
    console.log(`📸 Taking screenshot of: ${config.url}`);
    console.log(`💾 Saving to: ${config.path}`);

    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'] // For better stability
    });

    const page = await browser.newPage();

    // Set viewport for consistency
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate with networkidle for better stability
    let retries = config.retries;
    let lastError;

    while (retries > 0) {
      try {
        await page.goto(config.url, {
          waitUntil: 'networkidle',
          timeout: config.timeout
        });
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`⏳ Navigation failed, retrying (${retries} left)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (lastError) {
      throw new Error(`Failed to navigate after ${config.retries} retries: ${lastError.message}`);
    }

    // Wait for any pending animations/transitions
    await new Promise(resolve => setTimeout(resolve, config.waitTime));

    // Take screenshot
    await page.screenshot({
      path: config.path,
      fullPage: config.fullPage
    });

    console.log(`✅ Screenshot saved to: ${config.path}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run
takeScreenshot();
