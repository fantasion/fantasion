---
name: test-in-browser
description: Use when verifying visual changes, testing user flows, or comparing component behavior in a real browser
---

# Test in Browser

Use Playwright to take screenshots, navigate the app, and verify visual changes work correctly in a real browser.

## Quick Screenshot

Use the stable screenshot script committed to the repo:

```bash
# Take screenshot of Czech homepage (default)
node screenshot.mjs

# Take screenshot of a different page
SCREENSHOT_URL="http://localhost:3000/cs/prehled" node screenshot.mjs

# The script saves to: screenshot-<timestamp>.png
```

The `screenshot.mjs` script in the project root is stable, environment-aware, and ready for CI/CD integration. It automatically uses the default Czech locale and is tested for reliability.

## Before Screenshot: Verify Servers

Always ensure both servers are running first:

```bash
curl -s http://localhost:3000 > /dev/null && echo "Frontend: ✅" || echo "Frontend: ❌"
curl -s http://localhost:8000/api/v1 > /dev/null && echo "Backend: ✅" || echo "Backend: ❌"
```

If either shows ❌, use the `/run-fantasion-servers` skill first.

## Common URLs to Test

| Route | Purpose |
|-------|---------|
| http://localhost:3000/en | Homepage (English) |
| http://localhost:3000/cs | Homepage (Czech) |
| http://localhost:3000/en/orders | Orders list |
| http://localhost:3000/en/family | Family management |
| http://localhost:3000/en/expeditions | Expeditions list |

## Full Browser Interaction Example

```bash
cat > interact.mjs << 'EOF'
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Navigate to page
await page.goto('http://localhost:3000/en/orders');

// Take screenshot of initial state
await page.screenshot({ path: './before.png' });

// Click a button
await page.click('button:has-text("Submit")');

// Wait for navigation
await page.waitForNavigation();

// Take screenshot after action
await page.screenshot({ path: './after.png' });

console.log('✅ Screenshots saved');
await browser.close();
EOF

node interact.mjs
```

## Taking Targeted Screenshots

```javascript
// Full page
await page.screenshot({ path: './full.png', fullPage: true });

// Just viewport
await page.screenshot({ path: './viewport.png' });

// Single element
const button = page.locator('button[type="submit"]');
await button.screenshot({ path: './button.png' });
```

## Common Issues

| Problem | Solution |
|---------|----------|
| "Connection refused" | Start servers: use `/run-fantasion-servers` skill |
| "Page loads blank" | Check server logs: `tail /tmp/frontend.log` |
| "Screenshot is blank" | Add waitUntil: `await page.goto(url, { waitUntil: 'networkidle' })` |
| "Element not found" | Verify selector exists: `await page.isVisible('.selector')` |

## Script Location

Write Playwright scripts in the **project root** (same directory as `package.json`), so they can access node_modules.

If you write to `/tmp`, the script can't find Playwright.

## Cleanup

```bash
# Remove screenshot files
rm -f screenshot.png before.png after.png

# Keep project clean
rm -f screenshot.mjs interact.mjs
```

## Integration with Development

Use browser testing when:
- ✅ Verifying visual changes match design intent
- ✅ Testing user flows and interactions
- ✅ Comparing before/after of CSS modifications
- ✅ Checking component responsiveness
- ✅ Validating form submissions

Don't use for:
- ❌ Unit testing (use Jest)
- ❌ API testing (use curl or test scripts)
- ❌ Type checking (use `pnpm run type-check`)
