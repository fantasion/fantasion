# Component Extraction Plan: fantasion-web → @fantasion/ui

This document outlines the plan to extract visually heavy components from `fantasion-web` into the `@fantasion/ui` package.

## Progress Summary

| Phase | Status | Components |
|-------|--------|------------|
| Phase 1: Forms System | ✅ Complete | FormField, FormErrorAlert, FormActions |
| Phase 2: Search Components | ✅ Complete | SelectBubble, Combobox |
| Phase 3: Content Components | ✅ Complete | MarkdownContent, Article (5 variants), QuoteCarousel, Quote |
| Phase 4: Layout Components | ✅ Complete | BrandLogo, ContactInfoCard, HeroSection, FeatureSection |

**Total new components: 16**

---

## ✅ Phase 1: Forms System (Complete)

**New components in `@fantasion/ui/forms/`:**

- `FormField` - Compound form field with label, input, and validation display
  - Sub-components: `FormField.Label`, `FormField.Input`, `FormField.Feedback`
- `FormErrorAlert` - Alert-based error display for form-level errors
- `FormActions` - Submit/Cancel button layout with loading state

**Updated in fantasion-web:**
- `forms/FormControls.tsx` - Uses `FormActions` from @fantasion/ui
- `forms/FormError.tsx` - Uses `FormErrorAlert` from @fantasion/ui

---

## ✅ Phase 2: Search Components (Complete)

**New components in `@fantasion/ui/search/`:**

- `SelectBubble` - Tag/chip for multi-select displays with remove button
- `Combobox` - Full-featured autocomplete dropdown with:
  - Multi-select support via `SelectBubble`
  - Keyboard navigation (downshift)
  - Loading/empty states
  - Configurable item rendering

**Reused existing components:**
- `DropdownMenu` from `overlays/` for dropdown rendering

---

## ✅ Phase 3: Content Components (Complete)

**New components in `@fantasion/ui/content/`:**

### MarkdownContent
- Markdown renderer with rehype-raw plugin support
- Configurable heading offset for nested content
- Location: `content/MarkdownContent/`

### Article Components
Location: `content/Article/`

| Component | Description |
|-----------|-------------|
| `Article` | Full article layout with title, description, text, and media gallery |
| `ArticleBody` | Markdown content section |
| `ArticleLead` | Italicized intro/lead paragraph |
| `ArticleHeading` | Heading with optional link (supports custom link renderer via `renderLink` prop) |
| `ArticleStub` | Compact article with heading and text |

### Quote Components
Location: `content/QuoteCarousel/`

| Component | Description |
|-----------|-------------|
| `Quote` | Single blockquote with author attribution |
| `QuoteCarousel` | Rotating carousel of quotes using `useRotatingIndex` hook |

**Updated in fantasion-web:**
- `content/MarkdownContent.tsx` - Re-exports from @fantasion/ui
- `content/Article.tsx` - Wrapper using `ArticleHeading` with Fantasion's `Link` component
- `content/FlavourTextCarousel.tsx` - Wrapper mapping `flavourTexts` (with `quoteOwner`) to `quotes` (with `author`)

---

## ✅ Phase 4: Layout Components (Complete)

**New components in `@fantasion/ui/layout/`:**

### BrandLogo
Location: `layout/BrandLogo/`

- Renders a brand logo as an SVG
- Supports two modes:
  1. Direct SVG reference via `logoSrc`
  2. SVG sprite sheet with `logoSrc` and `symbolId`
- Configurable dimensions and alt text

### ContactInfoCard
Location: `layout/ContactInfoCard/`

- Displays contact information in a card layout
- Supports:
  - Contact items (email, phone, etc.) with optional links
  - Address information using the existing `Address` component
  - Bank account information with customizable labels
- All labels passed as props for i18n flexibility

### HeroSection
Location: `layout/HeroSection/`

- Hero layout with two columns (content + visual)
- Features:
  - Visually hidden h1 title for accessibility
  - Optional background element
  - Reversible column order
  - Fluid container options

### FeatureSection
Location: `layout/FeatureSection/`

- Highlighted section with title and content
- Features:
  - Optional background element
  - Configurable heading level
  - Customizable as section/div/article

**Updated in fantasion-web:**
- `components/SiteLogo.tsx` - Uses `BrandLogo` with Fantasion's specific logo SVG
- `components/ContactCard.tsx` - Uses `ContactInfoCard` with translated labels
- `components/home.tsx` - Uses `HeroSection` and `FeatureSection` with Fantasion-specific styling

---

## File Structure After Extraction

```
packages/fantasion-ui/
├── forms/
│   ├── index.ts
│   ├── FormField/
│   ├── FormErrorAlert/
│   └── FormActions/
├── search/
│   ├── index.ts
│   ├── Combobox/
│   └── SelectBubble/
├── content/
│   ├── ... (existing)
│   ├── MarkdownContent/
│   ├── Article/
│   └── QuoteCarousel/
└── layout/
    ├── index.ts
    ├── BrandLogo/
    ├── ContactInfoCard/
    ├── HeroSection/
    └── FeatureSection/
```

---

## Components NOT Extracted (Remain in fantasion-web)

Due to heavy business logic coupling:

| Directory | Reason |
|-----------|--------|
| `components/orders/` | Order management workflows, API calls |
| `components/expeditions/` | Expedition domain logic |
| `components/circle/` | Participant circle logic |
| `components/auth/` | Authentication flows |
| `components/family/` | Family/participant management |
| `components/signups.tsx` | Signup wizard with API |
| `components/transports/` | Transport tracking logic |
| `components/profiles.tsx` | Profile management |
| `components/context.tsx` | App-specific context providers |

---

## Verification Summary

All extracted components meet these criteria:

- ✅ No direct API calls (`useFetch`, `fetch`)
- ✅ No direct i18n (`useTranslation`) - accept strings as props
- ✅ No direct form library integration - accept callbacks
- ✅ Has Storybook story with variants
- ✅ Has TypeScript types exported
- ✅ Has SCSS module with design tokens
- ✅ fantasion-web wrapper created and working

---

## Final Component Count

| Category | New Components |
|----------|----------------|
| Forms | 3 (FormField, FormErrorAlert, FormActions) |
| Search | 2 (Combobox, SelectBubble) |
| Content | 7 (MarkdownContent, Article, ArticleBody, ArticleLead, ArticleHeading, ArticleStub, Quote, QuoteCarousel) |
| Layout | 4 (BrandLogo, ContactInfoCard, HeroSection, FeatureSection) |
| **Total** | **16** |

This brings @fantasion/ui from ~40 to ~56 components.
