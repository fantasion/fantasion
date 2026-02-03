---
name: component-visual-check
description: Visual verification workflow for React components using browser screenshots and comparison
user-invocable: true
disable-model-invocation: true
---

# Component Visual Check Skill

A structured workflow for making and verifying visual changes to React components in Fantasion.

## Overview

This skill automates the visual development cycle:
1. **Start dev server** - Ensure frontend is running
2. **Navigate component** - Visit the page/component in browser
3. **Take screenshot** - Capture current state using Playwright
4. **Describe intent** - What visual changes should happen?
5. **Make changes** - Edit component CSS/layout
6. **Verify** - Take new screenshot and compare
7. **Iterate** - Repeat until it matches intent

## Prerequisites

- Playwright MCP installed and running
- Frontend dev server on port 3000 (`pnpm run web`)
- Component file path ready to edit

## Workflow Steps

### Step 1: Prepare the Component

User should provide:
- What component to modify (e.g., "OrderPayment button styling")
- What visual change is needed (e.g., "Make primary button blue instead of green")
- Which page/route to test it on

**Example user request:**
```
Using /component-visual-check, update the OrderPayment component's
primary button color from green to brand blue (#1f3a93)
```

### Step 2: Start Dev Server (if needed)

Check if port 3000 is already running:
```bash
curl -s http://localhost:3000 > /dev/null && echo "Running" || echo "Not running"
```

If not running, start it:
```bash
pnpm run web
# Wait for "ready - started server on 0.0.0.0:3000"
```

### Step 3: Navigate and Screenshot

Using Playwright:
1. Open browser to component's route
2. Take screenshot of current state
3. Save with descriptive name: `before_[component]_[change].png`

**Example Playwright code:**
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/en/orders/123');
  await page.screenshot({ path: 'before_payment.png', fullPage: true });
  await browser.close();
})();
```

### Step 4: Make Changes

Edit the component file and its SCSS:
- Read component (e.g., `packages/fantasion-web/components/orders/OrderPayment.tsx`)
- Update styling/layout
- Verify no TypeScript errors: `pnpm run type-check`

### Step 5: Take After Screenshot

Take another screenshot to compare:
```javascript
// Same as Step 3, but save as 'after_[component]_[change].png'
```

### Step 6: Compare & Iterate

Compare before/after screenshots:
- Does the change match the intent?
- Any unintended side effects?
- Spacing/alignment correct?

If not matching:
1. Identify the issue (color, spacing, alignment, etc.)
2. Make another adjustment
3. Retake screenshot
4. Compare again

## Architecture Notes

### Component Organization

Fantasion components are organized by domain in `packages/fantasion-web/components/`:
- `orders/` - Order-related components
- `family/` - Family/participant components
- `expeditions/` - Expedition-related components
- `transports/` - Transport components
- `layout/` - Layout components (Header, Footer, Navigation)
- `auth/` - Authentication components

### Styling System

- **SCSS modules**: Component styles in `.module.scss` files
- **Bootstrap 5**: React Bootstrap components used throughout
- **Variables**: CSS variables defined in component context

**Example component structure:**
```
OrderPayment.tsx          # React component
OrderPayment.module.scss  # Component-scoped styles
```

### Types & Forms

- Forms use React Hook Form + Zod validation
- Types are TypeScript, checked with `pnpm run type-check`
- API client in `lib/api.ts` with token auth

## Example Workflow

**User Request:**
"Update the ContactCard component heading to use a larger, bolder font"

**Execution:**

1. **Check dev server:**
   ```bash
   curl -s http://localhost:3000 > /dev/null && echo "Running"
   ```

2. **Navigate to component** (e.g., contact page with ContactCard)
   ```
   http://localhost:3000/en/contact
   ```

3. **Take before screenshot**
   ```
   components/ContactCard screenshot saved
   ```

4. **Make changes** to `packages/fantasion-web/components/ContactCard.tsx`
   - Update heading styling
   - Increase font-size, font-weight

5. **Take after screenshot** and compare
   - Verify heading is larger and bolder
   - Check spacing is still correct

6. **If matching** → Done!

7. **If not matching** → Adjust and repeat from step 4

## Tips

- **Port 3000**: Fantasion dev server runs on port 3000 by default
- **Component lookup**: Search by component name (e.g., "OrderPayment") or by domain (e.g., "orders/")
- **SCSS modules**: Styles are scoped to component, won't affect others
- **Bootstrap**: Use React Bootstrap for consistency with existing UI
- **i18n**: Pages may need language param (e.g., `/en/orders/123`)

## Tools Used

- **Playwright MCP**: Browser automation, screenshots, navigation
- **Text editors**: Edit component TypeScript/SCSS
- **Dev server**: `pnpm run web` runs the app
- **Type checking**: `pnpm run type-check` validates changes

## When to Use This Skill

Use `/component-visual-check` when:
- ✅ Updating component styling/layout
- ✅ Adding visual features (colors, spacing, sizing)
- ✅ Modifying component appearance
- ✅ Verifying visual changes match design intent

Don't use this skill for:
- ❌ Logic changes (use standard development)
- ❌ API/data changes (use backend skill)
- ❌ Component structure changes (complex refactoring)
