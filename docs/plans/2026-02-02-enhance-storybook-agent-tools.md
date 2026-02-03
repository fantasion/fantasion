# Enhance Storybook with Agent-Friendly Design Development Tools

**Date:** 2026-02-02
**Status:** Planned

## Overview

Add tools to the Fantasion UI Storybook setup that help AI agents (like Claude) with design development by providing programmatic feedback, visual verification, and accessibility testing.

## Current State

**Storybook Setup:**
- Version 8.6.14 with React 19 + Vite
- 23 stories covering basic components (Alert, Badge, Button, Card, forms, etc.)
- Domain components (datetime, location, media, money, orders, profile, signups, transport) have NO stories
- Dark/light theme support working
- `@storybook/test` installed but unused

**Missing Tools:**
- No accessibility testing addon
- No visual regression or screenshot capabilities
- No programmatic testing with play functions
- Design tokens not documented in Storybook
- No CI integration for Storybook tests

## Implementation Plan

### Phase 1: Foundation Tools (P0 - Immediate Value)

#### 1.1 Install Accessibility Addon

**File:** `packages/fantasion-ui/package.json`
```bash
pnpm add -D @storybook/addon-a11y --filter @fantasion/ui
```

**File:** `packages/fantasion-ui/.storybook/main.ts`
- Add `"@storybook/addon-a11y"` to the `addons` array

**Agent Value:**
- Real-time accessibility violations in Storybook panel
- Programmatic feedback (no visual inspection needed)
- Catches ARIA issues, color contrast problems, keyboard navigation issues
- JSON-structured output that agents can parse

#### 1.2 Create Design Tokens Documentation

**File:** `packages/fantasion-ui/styles/DesignTokens.mdx` (NEW)

Document all design tokens from `styles/variables.scss`:
- **Spacing Scale**: 4px grid system (xs=4px, sm=8px, md=16px, lg=24px, xl=48px)
- **Colors**: Brand (Minsk Purple #472a7e, Buddha Gold #d7a600, Early Dawn #fffaeb), semantic, grayscale
- **Typography**: Raleway base font, Fira Code monospace, size scale
- **Breakpoints**: sm (576px), md (768px), lg (992px), xl (1200px), xxl (1400px)
- **Shadows, borders, transitions**

**File:** `packages/fantasion-ui/.storybook/main.ts`
- Stories pattern should include `../**/*.mdx`

**Agent Value:**
- Single source of truth for design values
- Agents reference before creating components
- Ensures consistency across implementations
- No need to parse SCSS files

#### 1.3 Set Up Storybook Test Runner

**Installation:**
```bash
pnpm add -D @storybook/test-runner axe-playwright --filter @fantasion/ui
```

**File:** `packages/fantasion-ui/.storybook/test-runner.js` (NEW)
```javascript
const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
  async preRender(page) {
    await injectAxe(page);
  },
  async postRender(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  }
};
```

**File:** `packages/fantasion-ui/package.json`
- Add script: `"test:storybook": "test-storybook --json --outputFile test-results.json"`
- Add script: `"test:storybook-ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"pnpm build-storybook && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:127.0.0.1:6006 && pnpm test:storybook\""`

**Dependencies to add:** `concurrently`, `wait-on`, `http-server`

**Agent Value:**
- Automated accessibility checks across all stories
- JSON output for programmatic parsing
- Runs in CI without manual review
- Catches regressions before merge

### Phase 2: Visual Verification Tools (P1)

#### 2.1 Configure Responsive Viewports

**File:** `packages/fantasion-ui/.storybook/preview.tsx`

Add to the `parameters` object:
```typescript
viewport: {
  viewports: {
    mobile: { name: 'Mobile (sm)', styles: { width: '576px', height: '800px' } },
    tablet: { name: 'Tablet (md)', styles: { width: '768px', height: '1024px' } },
    desktop: { name: 'Desktop (lg)', styles: { width: '992px', height: '768px' } },
    wide: { name: 'Wide (xl)', styles: { width: '1200px', height: '768px' } },
    ultrawide: { name: 'Ultra Wide (xxl)', styles: { width: '1400px', height: '768px' } }
  }
}
```

**Agent Value:**
- Test components at all breakpoints via toolbar
- Screenshots can capture responsive behavior
- Verify mobile/tablet/desktop layouts

#### 2.2 Implement Screenshot Testing

**File:** `packages/fantasion-ui/.storybook/screenshot-test.ts` (NEW)

Create Playwright script to:
1. Build Storybook and extract stories.json
2. Visit each story in iframe
3. Capture screenshot
4. Store in `packages/fantasion-ui/.storybook/screenshots/`
5. Compare with baselines using pixelmatch
6. Generate diff images for changes

**Dependencies:**
```bash
pnpm add -D pixelmatch pngjs --filter @fantasion/ui
```

**File:** `packages/fantasion-ui/package.json`
- Add script: `"test:screenshots": "tsx .storybook/screenshot-test.ts"`
- Add script: `"test:screenshots-update": "tsx .storybook/screenshot-test.ts --update-baselines"`

**Agent Value:**
- Visual proof that changes work correctly
- Detect unintended visual regressions
- Works with Playwright MCP server
- Can be integrated into CI

#### 2.3 Add Interaction Tests to Key Components

**Files to update:**
- `packages/fantasion-ui/buttons/Button.stories.tsx`
- `packages/fantasion-ui/forms/Form.stories.tsx`
- `packages/fantasion-ui/overlays/Modal.stories.tsx`
- `packages/fantasion-ui/navigation/Nav.stories.tsx`

Add play functions using `@storybook/test`:
```typescript
import { expect, userEvent, within, fn } from '@storybook/test';

export const ClickTest: Story = {
  args: {
    children: 'Click me',
    onClick: fn()
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
};
```

**Agent Value:**
- Test user interactions programmatically
- Verify component behavior without manual testing
- Runs automatically with test-runner
- JSON output for CI

### Phase 3: Documentation Improvements (P1)

#### 3.1 Complete Args Tables for All Stories

**Files:** All 23 existing story files

For each story, ensure:
- `tags: ['autodocs']` is present
- `argTypes` defined for complex props
- Default values documented
- Descriptions added for non-obvious props

**Example:**
```typescript
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline-primary', 'outline-secondary'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button (maps to design token spacing scale)'
    }
  }
};
```

**Agent Value:**
- Auto-generated props documentation
- Agents know available props without reading source
- Controls for testing different combinations

#### 3.2 Create Stories for Domain Components

**New files to create (15-20 stories):**
- `packages/fantasion-ui/datetime/*.stories.tsx`
- `packages/fantasion-ui/location/*.stories.tsx`
- `packages/fantasion-ui/media/*.stories.tsx`
- `packages/fantasion-ui/money/*.stories.tsx`
- `packages/fantasion-ui/orders/*.stories.tsx`
- `packages/fantasion-ui/profile/*.stories.tsx`
- `packages/fantasion-ui/signups/*.stories.tsx`
- `packages/fantasion-ui/transport/*.stories.tsx`

**Goal:** Increase coverage from 23 to 40+ stories

**Agent Value:**
- Domain components can be developed/tested in isolation
- Full component library coverage
- Accessibility testing for all components

### Phase 4: CI/CD Integration (P1)

#### 4.1 Add Storybook Tests to GitHub Actions

**File:** `.github/workflows/integration.yml`

Add new job after existing test jobs:
```yaml
storybook_tests:
  name: Storybook Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'pnpm'
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    - name: Install Playwright
      run: pnpm exec playwright install --with-deps chromium
    - name: Run Storybook tests
      run: pnpm --filter @fantasion/ui run test:storybook-ci
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v6
      with:
        name: storybook-test-results
        path: packages/fantasion-ui/test-results.json
    - name: Upload screenshots on failure
      if: failure()
      uses: actions/upload-artifact@v6
      with:
        name: storybook-screenshots
        path: packages/fantasion-ui/.storybook/screenshots/
```

**Agent Value:**
- Automated checks on every PR
- JSON test results as artifacts
- Blocks merges if tests fail (optional)
- Screenshot diffs on failures

### Phase 5: Future Enhancements (P2 - Optional)

#### 5.1 Deploy Storybook to GitHub Pages

Add deployment job to `.github/workflows/integration.yml` (runs on master only)

**Agent Value:**
- Live Storybook URL for reference
- Share component catalog publicly
- Test in production-like environment

#### 5.2 Create Component Usage Documentation

Create MDX files with usage patterns:
- `packages/fantasion-ui/forms/FormUsage.mdx`
- `packages/fantasion-ui/overlays/ModalUsage.mdx`
- `packages/fantasion-ui/grid/LayoutPatterns.mdx`

**Agent Value:**
- Learn project conventions
- Follow established patterns
- Reduce need for human guidance

#### 5.3 Extract Design Tokens to JSON

Create script to parse SCSS variables and export JSON:
- `packages/fantasion-ui/scripts/extract-tokens.ts`
- Output: `packages/fantasion-ui/design-tokens.json`

**Agent Value:**
- Programmatic access to design tokens
- Can be imported in tests/scripts
- Easier than parsing SCSS

## Priority Summary

**P0 - Start Here (Week 1):**
1. Install @storybook/addon-a11y
2. Create Design Tokens MDX documentation
3. Set up test-runner with accessibility checks

**P1 - Core Workflow (Weeks 2-4):**
4. Configure responsive viewports
5. Implement screenshot testing
6. Add interaction tests to key components
7. Complete args tables for all stories
8. Create stories for domain components
9. Add CI integration

**P2 - Polish (Later):**
10. Deploy Storybook to GitHub Pages
11. Create usage documentation MDX
12. Extract design tokens to JSON

## Critical Files

- `packages/fantasion-ui/.storybook/main.ts` - Addon configuration
- `packages/fantasion-ui/.storybook/preview.tsx` - Viewport and theme config
- `packages/fantasion-ui/.storybook/test-runner.js` - Test configuration (NEW)
- `packages/fantasion-ui/.storybook/screenshot-test.ts` - Screenshot script (NEW)
- `packages/fantasion-ui/styles/DesignTokens.mdx` - Token documentation (NEW)
- `packages/fantasion-ui/package.json` - Scripts and dependencies
- `.github/workflows/integration.yml` - CI integration

## Verification

After Phase 1 (P0 tools):
1. Start Storybook: `cd packages/fantasion-ui && pnpm storybook`
2. Verify accessibility addon appears in panel (bottom tabs)
3. Open any story and check for a11y violations
4. Navigate to Design Tokens docs page
5. Run `pnpm --filter @fantasion/ui test:storybook-ci`
6. Verify test-results.json is created with accessibility data

After Phase 2 (P1 visual tools):
1. Run `pnpm --filter @fantasion/ui test:screenshots`
2. Verify screenshots created in `.storybook/screenshots/`
3. Test viewport switcher in Storybook toolbar
4. Open Button story and verify interaction test runs
5. Check CI pipeline shows Storybook tests passing

After Phase 3 (P1 documentation):
1. Browse all stories and verify args tables present
2. Confirm domain component stories exist
3. Test component variations via controls
4. Verify autodocs pages generated

After Phase 4 (CI integration):
1. Create PR and verify Storybook tests run
2. Check test results artifact uploaded
3. Confirm tests must pass before merge

## Success Metrics

- **Story Coverage:** 23 → 40+ stories
- **A11y Pass Rate:** 0% (no testing) → 95%+ (after fixes)
- **Visual Regression Detection:** 0 → 100% of stories monitored
- **Agent Confidence:** 40% → 80%+ (subjective)
- **PR Review Time:** Reduced by 30-50% (automated checks)

## Integration with Playwright MCP

Agents can use Playwright MCP server to:
1. Navigate to Storybook: `browser_navigate("http://localhost:6006")`
2. Take screenshots: `browser_take_screenshot()`
3. Run accessibility audits: `browser_evaluate()` with axe-core
4. Test interactions: Click, type, submit forms
5. Capture console errors: `browser_console_messages()`

## Dependencies to Install

```bash
# Phase 1
pnpm add -D @storybook/addon-a11y --filter @fantasion/ui
pnpm add -D @storybook/test-runner axe-playwright --filter @fantasion/ui
pnpm add -D concurrently wait-on http-server --filter @fantasion/ui

# Phase 2
pnpm add -D pixelmatch pngjs --filter @fantasion/ui
pnpm add -D tsx --filter @fantasion/ui
```

All tools provide **programmatic output** (JSON, structured data) that agents can parse without visual inspection.
