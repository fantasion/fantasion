---
name: storybook-testing
description: Use when developing UI components, testing accessibility, verifying visual changes, or checking component behavior in Storybook
---

# Storybook Testing & Development

Use Storybook for component development, accessibility testing, visual regression testing, and interaction testing in the `@fantasion/ui` package.

## Quick Start

```bash
# Start Storybook development server
cd packages/fantasion-ui
pnpm storybook  # Opens at http://localhost:6006

# Build static Storybook
pnpm build-storybook  # Outputs to storybook-static/
```

## Testing Commands

### Accessibility Tests

```bash
cd packages/fantasion-ui

# Run accessibility tests (requires Storybook server running)
pnpm test:storybook

# CI-ready: builds Storybook and runs tests
pnpm test:storybook-ci

# View results
cat test-results.json
```

**What it tests:**
- WCAG compliance (axe-core checks)
- Color contrast ratios
- ARIA attributes
- Keyboard navigation
- Form labels and associations

### Visual Regression Tests

```bash
cd packages/fantasion-ui

# Run screenshot tests (requires Storybook server)
pnpm test:screenshots

# Update baselines after intentional changes
pnpm test:screenshots-update

# View diff images
ls .storybook/screenshots/diff/
```

**What it captures:**
- Screenshots of all stories (baseline vs actual)
- Pixel-perfect comparison (0.5% threshold)
- Diff images highlighting changes
- Mismatch percentage per story

### Interaction Tests

Interaction tests run automatically with `test:storybook`. They verify:
- Button clicks and callbacks
- Form submissions
- Modal open/close
- Navigation interactions
- Disabled state handling

## Design Tokens Reference

Instead of parsing SCSS files, reference design tokens in Storybook:

**Navigate to:** Storybook → Design System → Design Tokens

Or read: `packages/fantasion-ui/styles/DesignTokens.mdx`

**Key tokens:**
```typescript
// Spacing (4px grid)
$spacer-xs: 4px
$spacer-sm: 8px
$spacer-md: 16px  // default
$spacer-lg: 24px
$spacer-xl: 48px

// Brand colors
$color-primary: #472a7e  // Minsk Purple
$color-secondary: #d7a600  // Buddha Gold
$color-background: #fffaeb  // Early Dawn

// Breakpoints
$breakpoint-sm: 576px
$breakpoint-md: 768px
$breakpoint-lg: 992px
$breakpoint-xl: 1200px
$breakpoint-xxl: 1400px
```

## Creating New Stories

### Basic Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./YourComponent.js";

const meta: Meta<typeof YourComponent> = {
  title: "Components/YourComponent",  // or "Domain/Category/YourComponent"
  component: YourComponent,
  parameters: {
    layout: "centered",  // or "padded", "fullscreen"
  },
  tags: ["autodocs"],  // Enable auto-generated docs
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success"],
      description: "Visual style variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the component",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "primary",
    children: "Click me",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <YourComponent variant="primary">Primary</YourComponent>
      <YourComponent variant="secondary">Secondary</YourComponent>
      <YourComponent variant="success">Success</YourComponent>
    </div>
  ),
};
```

### Story with Interaction Test

```typescript
import { expect, fn, userEvent, within } from "@storybook/test";

export const ClickTest: Story = {
  args: {
    onClick: fn(),  // Mock function to track calls
    children: "Click me",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find element by role (accessible!)
    const button = canvas.getByRole("button");

    // Simulate user interaction
    await userEvent.click(button);

    // Assert behavior
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const FormTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill form fields
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");

    const passwordInput = canvas.getByLabelText(/password/i);
    await userEvent.type(passwordInput, "password123");

    // Submit form
    const submitButton = canvas.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify values
    await expect(emailInput).toHaveValue("test@example.com");
  },
};
```

## Testing Responsive Behavior

Use the viewport toolbar in Storybook:

1. Open any story
2. Click viewport icon in toolbar
3. Select: Mobile (576px) | Tablet (768px) | Desktop (992px) | Wide (1200px) | Ultra Wide (1400px)

## Using with Playwright MCP

When Playwright MCP is available:

```typescript
// Navigate to Storybook
browser_navigate("http://localhost:6006")

// Take screenshot of specific story
browser_navigate("http://localhost:6006/iframe.html?id=components-button--default")
browser_take_screenshot({ filename: "button-default.png" })

// Run accessibility audit on story
browser_navigate("http://localhost:6006/iframe.html?id=components-form--default")
browser_evaluate(() => axe.run())

// Test interaction
browser_click({ element: "Primary button", ref: "button-ref" })
browser_type({ element: "Email input", ref: "input-ref", text: "test@example.com" })

// Capture console errors
browser_console_messages({ level: "error" })
```

## Story Organization

```
packages/fantasion-ui/
├── buttons/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx  ← Story file
│       └── Button.test.tsx
├── forms/
│   ├── Form.tsx
│   └── Form.stories.tsx
├── datetime/  ← Domain components
│   ├── DateLabel.tsx
│   └── DateLabel.stories.tsx
└── styles/
    └── DesignTokens.mdx  ← Design token docs
```

**Naming convention:**
- Components: `Components/ButtonGroup`
- Domain: `Domain/DateTime/DateLabel`
- Design System: `Design System/Design Tokens`

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 6006
lsof -ti:6006 | xargs kill -9 2>/dev/null

# Or use different port
pnpm storybook --port 6007
```

### Test Runner Fails

```bash
# Check Storybook is running first
curl -s http://localhost:6006 > /dev/null && echo "✅ Running" || echo "❌ Not running"

# If not running, start it
cd packages/fantasion-ui && pnpm storybook &

# Wait for it to be ready
sleep 5

# Run tests
pnpm test:storybook
```

### Screenshot Tests Show False Positives

```bash
# Update baselines if changes are intentional
pnpm test:screenshots-update

# Check specific diff images
open .storybook/screenshots/diff/components-button-default.png
```

### Interaction Test Fails

1. Check the test output in `test-results.json`
2. Run Storybook and manually test the story
3. Check console for errors: `browser_console_messages()`
4. Verify selectors use accessible roles: `getByRole("button")`

## CI Integration

Storybook tests run automatically in GitHub Actions on every push:

**Job:** `storybook_tests` in `.github/workflows/integration.yml`

**What runs:**
- Builds Storybook statically
- Installs Playwright
- Runs accessibility tests
- Uploads test results as artifacts
- Uploads screenshots on failure

**View results:**
- GitHub Actions → workflow run → Artifacts
- Download `storybook-test-results` for JSON results
- Download `storybook-screenshots` for visual diffs (on failure)

## When to Use Storybook

### ✅ Use Storybook for:
- Developing UI components in isolation
- Testing component variations (props, states)
- Verifying accessibility compliance
- Visual regression testing
- Documenting component APIs
- Checking responsive behavior
- Testing user interactions
- Design system documentation

### ❌ Don't use Storybook for:
- End-to-end user flows (use Playwright E2E tests)
- API integration testing (use API tests)
- Business logic testing (use unit tests)
- Full app testing (use `/test-in-browser` skill)

## Current Coverage

**Total stories:** 29 (as of 2026-02-02)

**Components with stories:**
- Core: Alert, Badge, Button, Card, Collapse, Form, Modal, Nav
- DateTime: DateLabel, DateTimeLabel
- Money: Money, PriceLabel
- Location: Address
- And more...

**Missing stories (contributions welcome):**
- Media components (LightBox, galleries)
- Order components (OrderPayment, OrderStatus)
- Signup components
- Transport components

## Best Practices

1. **Always add argTypes** - Document props with descriptions and defaults
2. **Include multiple examples** - Show different states and variations
3. **Add interaction tests** - For interactive components (buttons, forms)
4. **Use accessible selectors** - `getByRole()`, `getByLabelText()` over `querySelector()`
5. **Test edge cases** - Empty states, errors, loading, disabled
6. **Update screenshots** - When visual changes are intentional
7. **Check a11y panel** - Fix violations before committing
8. **Reference design tokens** - Use DesignTokens.mdx, not SCSS files

## Quick Reference

| Task | Command |
|------|---------|
| Start Storybook | `pnpm storybook` |
| Build Storybook | `pnpm build-storybook` |
| Run a11y tests | `pnpm test:storybook-ci` |
| Screenshot tests | `pnpm test:screenshots` |
| Update baselines | `pnpm test:screenshots-update` |
| Design tokens | Open Storybook → Design System → Design Tokens |
| Story location | Next to component: `Component.stories.tsx` |
| View test results | `cat packages/fantasion-ui/test-results.json` |
