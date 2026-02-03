# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fantasion is a web application for a Czech non-profit summer camp organization (https://fantasion.cz). It's a monorepo with two main packages:

- **fantasion-web**: Next.js 16 frontend with React 19, TypeScript, and React Bootstrap
- **fantasion-backend**: Django REST API with Python 3.10+

## Package Manager

**IMPORTANT**: This project uses `pnpm`, not `npm`. Always use `pnpm` for all Node.js package operations.

## Commands

### Installation
```bash
pnpm install              # Install Node dependencies
pnpm run uv-install       # Install Python dependencies via uv
```

### Development
```bash
pnpm run web              # Run frontend dev server (port 3000)
pnpm run backend          # Run backend dev server (port 8000)
```

### Building
```bash
pnpm run build            # Build both packages
```

### Linting & Type Checking
```bash
# Frontend (from packages/fantasion-web/)
pnpm run lint             # Biome check
pnpm run type-check       # TypeScript check

# Backend (from packages/fantasion-backend/)
pnpm run lint             # Flake8
```

### Auto-Formatting & Fixing Linting Issues

**Frontend (Biome)**:
```bash
cd packages/fantasion-web
pnpm biome check --write .    # Auto-fix linting issues
```

**Backend (Python)**:
The backend uses Flake8 for linting, which does not auto-fix issues.
To auto-format Python code, you can use `autopep8`:

```bash
cd packages/fantasion-backend

# Install autopep8 (if not already in dependencies)
uv add --dev autopep8

# Auto-fix line length and PEP8 issues
uv run autopep8 --in-place --max-line-length=100 <file>.py

# Or fix all Python files recursively
uv run autopep8 --in-place --recursive --max-line-length=100 .
```

**IMPORTANT**:
- Always use `uv run` to execute Python tools in the backend, as the project
  uses `uv` for Python dependency management
- The backend follows PEP8 with a max line length of 100 characters
- Common Flake8 errors:
  - `E501`: Line too long (> 100 characters)
  - `E221`: Multiple spaces before operator
  - `E302`: Expected 2 blank lines, found 1
  - `E722`: Do not use bare 'except'
  - `F401`: Module imported but unused

### Testing
```bash
pnpm test                 # Run frontend Jest tests (from root)

# Backend
cd packages/fantasion-backend
uv run python ./manage.py test
```

### Database (Backend)
```bash
cd packages/fantasion-backend
pnpm run migrate          # Apply migrations
```

## Architecture

### Frontend (fantasion-web)

- **Framework**: Next.js 16 with App Router (migration in progress from Pages Router)
- **State/Forms**: React Hook Form with Zod validation
- **Styling**: SCSS with Bootstrap 5, React Bootstrap components
- **i18n**: next-intl with Czech (cs) and English locales in `messages/`
- **API Client**: Custom fetch wrapper in `api.ts` with token-based auth (cookie: `authToken`)

Key directories:
- `app/` - New App Router pages (migration in progress)
- `pages/` - Legacy Pages Router (being migrated)
- `components/` - React components organized by domain (family/, orders/, layout/, runes/)
- `i18n/` - Internationalization configuration (routing.ts, request.ts)
- `messages/` - Translation files (cs.json, en.json)

#### i18n Usage

**Server Components** (App Router pages):
```typescript
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations();
  return <h1>{t('page-title')}</h1>;
}
```

**Client Components**:
```typescript
'use client';
import { useTranslation } from '../lib/i18n-context';  // Compatibility wrapper

function MyComponent() {
  const { t } = useTranslation();
  return <p>{t('message-key')}</p>;
}
```

### Storybook (fantasion-ui)

The project includes a comprehensive Storybook setup for the `@fantasion/ui` component library with agent-friendly development tools.

#### Running Storybook
```bash
cd packages/fantasion-ui
pnpm storybook              # Development server (port 6006)
pnpm build-storybook        # Production build
```

#### Testing Commands
```bash
# Accessibility tests (requires Storybook server)
pnpm test:storybook

# CI-ready tests (builds + runs tests)
pnpm test:storybook-ci

# Visual regression tests (requires Storybook server)
pnpm test:screenshots

# Update screenshot baselines
pnpm test:screenshots-update
```

#### Features Available

**1. Accessibility Testing**
- Real-time violations in Storybook panel (a11y addon)
- Automated checks with axe-playwright
- JSON output for programmatic analysis
- Runs in CI on every push

**2. Visual Regression Testing**
- Screenshot capture for all stories
- Pixel-perfect comparison with baselines (pixelmatch)
- Diff generation for changes (0.5% threshold)
- Baseline management with `--update-baselines`

**3. Interaction Testing**
- Play functions for automated user interaction testing
- Examples: Button clicks, form submissions, modal open/close
- Uses `@storybook/test` (expect, userEvent, within)
- Runs with test-runner

**4. Responsive Testing**
- Viewport configurations in toolbar
- Breakpoints: mobile (576px), tablet (768px), desktop (992px), wide (1200px), ultrawide (1400px)
- Test components at all screen sizes

**5. Design Token Documentation**
- `styles/DesignTokens.mdx` - Single source of truth
- Documents: spacing scale, colors, typography, breakpoints, shadows, borders, transitions
- No need to parse SCSS files
- Accessible in Storybook docs

#### Story Coverage
- **Current**: 29 stories
- **Components**: Alert, Badge, Button, Card, Collapse, Form, Modal, Nav, and more
- **Domain components**: DateTime, Money, Location
- **All stories** include:
  - Comprehensive argTypes with descriptions
  - Multiple usage examples
  - Locale variations (Czech/English)
  - Edge cases

#### Working with Playwright MCP

When using Playwright MCP server with Storybook:
```typescript
// Navigate to Storybook
browser_navigate("http://localhost:6006")

// Take screenshots
browser_take_screenshot()

// Run accessibility audits
browser_evaluate(() => axe.run())

// Test interactions
browser_click({ ref: "button-element" })
browser_type({ ref: "input", text: "test@example.com" })

// Capture console errors
browser_console_messages()
```

#### Creating New Stories

**Location**: Place stories next to components (e.g., `Button/Button.stories.tsx`)

**Template**:
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./YourComponent.js";

const meta: Meta<typeof YourComponent> = {
  title: "Components/YourComponent",  // or "Domain/Category/YourComponent"
  component: YourComponent,
  tags: ["autodocs"],
  argTypes: {
    propName: {
      control: "select",  // or "boolean", "text", "number"
      options: ["option1", "option2"],
      description: "Clear description of what this prop does",
      table: {
        defaultValue: { summary: "defaultValue" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    propName: "value",
  },
};
```

**With interaction tests**:
```typescript
import { expect, fn, userEvent, within } from "@storybook/test";

export const InteractionTest: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

#### Design Tokens Reference

All design tokens are documented in Storybook. Key values:

**Spacing** (4px grid):
- `$spacer-xs`: 4px
- `$spacer-sm`: 8px
- `$spacer-md`: 16px (default)
- `$spacer-lg`: 24px
- `$spacer-xl`: 48px

**Brand Colors**:
- Primary: `#472a7e` (Minsk Purple)
- Secondary: `#d7a600` (Buddha Gold)
- Background: `#fffaeb` (Early Dawn)

**Breakpoints**:
- sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px

See `packages/fantasion-ui/styles/DesignTokens.mdx` for complete reference.

#### CI Integration

Storybook tests run automatically in GitHub Actions:
- On every push to any branch
- Accessibility checks with test-runner
- Test results uploaded as artifacts
- Screenshots uploaded on failure
- See `.github/workflows/integration.yml` (job: `storybook_tests`)

### Backend (fantasion-backend)

Django apps organized by domain:
- `fantasion/` - Core config and models
- `fantasion_api/` - REST API endpoints
- `fantasion_eshop/` - E-commerce (orders, payments)
- `fantasion_expeditions/` - Summer camp expeditions and batches
- `fantasion_signups/` - Camp registration system
- `fantasion_people/` - User and participant management
- `fantasion_locations/` - Leisure centres
- `fantasion_banking/` - Payment integration (fiobank)
- `fantasion_content/` - CMS content
- `fantasion_generics/` - Shared utilities

### API Integration

- Backend API: `http://localhost:8000/api/v1` (configurable via `API_URL` env var)
- Auth: Token-based with `Authorization: Token <token>` header
- Frontend stores auth token in `authToken` cookie

### Deployment

- Infrastructure: Terraform on Google Cloud Platform
- Docker containers for both frontend and backend
- CI/CD: GitHub Actions (`.github/workflows/integration.yml`)
- Environments: staging (master branch), production (version tags)

## Code Style

- **Frontend**: Biome for linting/formatting (extends `@cookielab.io/biome-config/next`)
- **Backend**: Flake8 for Python linting
- **Formatting**: Single quotes, no semicolons (configured in `.prettierrc`)

### ⚠️ IMPORTANT: Always Lint After Changes

**CRITICAL RULE**: After making ANY code changes, always run `pnpm lint` from the root directory and ensure it passes completely. This applies to all changes, even if the linting issues existed before your changes.

```bash
pnpm lint    # Must pass with 0 errors
```

**Why this matters**:
- Prevents accumulation of linting issues
- Ensures code quality remains consistent
- Makes code reviews faster and more focused
- Avoids "broken windows" syndrome where small issues compound

**What to do if linting fails**:
1. Read the error messages carefully
2. Use auto-fix where possible (see "Auto-Formatting" section below)
3. Fix remaining issues manually
4. Run `pnpm lint` again to verify
5. Repeat until all issues are resolved

**Never commit code with linting errors**, even if they seem unrelated to your changes.

### Naming Conventions

**IMPORTANT**: Never use generic, meaningless names for files, functions, or directories:
- ❌ `helpers.ts`, `utils.ts`, `hooks.ts`, `common.ts`, `misc.ts`, `stuff.ts`
- ❌ `_pages/`, `_utils/`, `_helpers/`
- ✅ Use semantic, descriptive names that clearly indicate purpose:
  - `server/auth.ts` - Authentication utilities
  - `server/request-context.ts` - Request context handling
  - `lib/locale.ts` - Locale/language utilities
  - `components/orders/` - Order-related components

Generic names create confusion and make code harder to navigate. Every file and function should have a clear, specific purpose reflected in its name.
