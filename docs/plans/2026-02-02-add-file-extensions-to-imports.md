# Add File Extensions to Imports in fantasion-ui

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `.js` extensions to all relative imports in fantasion-ui and configure TypeScript to require them for Storybook compatibility.

**Architecture:** Update ~105 import statements across all TypeScript/TSX files to include `.js` extensions (TypeScript uses `.js` for `.ts`/`.tsx` files when targeting ESM). Configure `tsconfig.json` with `moduleResolution: "bundler"` and update to use wildcard exports (`export *`) instead of exhaustive named exports.

**Tech Stack:** TypeScript 5.x, ESM modules

---

## Task 1: Configure TypeScript for Required Extensions

**Files:**
- Modify: `packages/fantasion-ui/tsconfig.json`

**Step 1: Update tsconfig.json to require extensions**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "target": "ESNext",
    "declaration": true,
    "declarationMap": true,
    "allowImportingTsExtensions": false
  },
  "include": ["index.ts", "**/*.ts", "**/*.tsx", "scss-modules.d.ts"],
  "exclude": ["node_modules", "dist", "storybook-static", ".storybook"]
}
```

**Changes:**
- Updated `include` pattern from `components/**/*` to `**/*` (components folder removed)
- Added `storybook-static` and `.storybook` to `exclude`
- Set `allowImportingTsExtensions: false` to enforce `.js` extensions

**Step 2: Verify configuration**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: Type errors about missing file extensions

---

## Task 2: Update Root Index File

**Files:**
- Modify: `packages/fantasion-ui/index.ts`

**Step 1: Replace exhaustive exports with wildcard exports and add extensions**

```typescript
"use client";

// Main entry point for @fantasion/ui
// Export all components

// Bootstrap components (keep alphabetically organized as before)
// Alerts & Feedback
export * from "./Alert/index.js";
export * from "./Badge/index.js";
// Buttons & Badges
export * from "./buttons/index.js";
// Card
export * from "./Card/index.js";
// Carousel
export * from "./Carousel/index.js";
// Collapse
export * from "./Collapse/index.js";
// Forms
export * from "./forms/index.js";
// Grid
export * from "./grid/index.js";
// Lists
export * from "./lists/index.js";
// Navigation
export * from "./navigation/index.js";
export * from "./Navbar/index.js";
// Overlays & Modals
export * from "./overlays/index.js";
export * from "./Toast/index.js";

// Domain-specific components (organized by business domain)
export * from "./content/index.js";
export * from "./datetime/index.js";
export * from "./location/index.js";
export * from "./media/index.js";
export * from "./money/index.js";
export * from "./orders/index.js";
export * from "./profile/index.js";
export * from "./signups/index.js";
export * from "./transport/index.js";
```

**Step 2: Verify exports work**

Run: `cd packages/fantasion-ui && pnpm build`
Expected: Build succeeds

---

## Task 3: Update Alert Components

**Files:**
- Modify: `packages/fantasion-ui/Alert/index.ts`

**Step 1: Replace with wildcard export**

```typescript
export * from "./Alert.js";
```

**Step 2: Verify no TypeScript errors**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Alert directory

---

## Task 4: Update Badge Components

**Files:**
- Modify: `packages/fantasion-ui/Badge/index.ts`
- Modify: `packages/fantasion-ui/Badge/Badge.stories.tsx`

**Step 1: Update Badge/index.ts with wildcard export**

```typescript
export * from "./Badge.js";
```

**Step 2: Update Badge.stories.tsx imports**

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge.js";

// ... rest of file unchanged
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Badge directory

---

## Task 5: Update Button Components

**Files:**
- Modify: `packages/fantasion-ui/buttons/index.ts`
- Modify: `packages/fantasion-ui/buttons/Button/index.ts`
- Modify: `packages/fantasion-ui/buttons/ButtonGroup/index.ts`
- Modify: `packages/fantasion-ui/buttons/CopyButton/index.ts`

**Step 1: Update buttons/index.ts**

```typescript
export * from "./Button/index.js";
export * from "./CopyButton/index.js";
export * from "./ButtonGroup/index.js";
```

**Step 2: Update buttons/Button/index.ts**

Replace contents with:
```typescript
export * from "./Button.js";
```

**Step 3: Update buttons/ButtonGroup/index.ts**

Replace contents with:
```typescript
export * from "./ButtonGroup.js";
```

**Step 4: Update buttons/CopyButton/index.ts**

Replace contents with:
```typescript
export * from "./CopyButton.js";
```

**Step 5: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in buttons directory

---

## Task 6: Update Card Components

**Files:**
- Modify: `packages/fantasion-ui/Card/index.ts`

**Step 1: Replace with wildcard export**

```typescript
export * from "./Card.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Card directory

---

## Task 7: Update Carousel Components

**Files:**
- Modify: `packages/fantasion-ui/Carousel/index.ts`
- Modify: `packages/fantasion-ui/Carousel/Carousel.stories.tsx`

**Step 1: Update Carousel/index.ts**

```typescript
export * from "./Carousel.js";
```

**Step 2: Update Carousel.stories.tsx imports**

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./Carousel.js";

// ... rest of file unchanged
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Carousel directory

---

## Task 8: Update Collapse Components

**Files:**
- Modify: `packages/fantasion-ui/Collapse/index.ts`
- Modify: `packages/fantasion-ui/Collapse/Collapse.stories.tsx`

**Step 1: Update Collapse/index.ts**

```typescript
export * from "./Collapse.js";
```

**Step 2: Update Collapse.stories.tsx imports**

```typescript
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Collapse } from "./Collapse.js";

// ... rest of file unchanged
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Collapse directory

---

## Task 9: Update Content Components

**Files:**
- Modify: `packages/fantasion-ui/content/index.ts`
- Modify: All `.tsx` files in `packages/fantasion-ui/content/` with relative imports

**Step 1: Update content/index.ts**

```typescript
export * from "./ContentBox/index.js";
export * from "./IconLabel/index.js";
export * from "./RichText/index.js";
```

**Step 2: Check for subdirectory index files and update them**

For `content/ContentBox/index.ts`:
```typescript
export * from "./ContentBox.js";
```

For `content/IconLabel/index.ts`:
```typescript
export * from "./IconLabel.js";
```

For `content/RichText/index.ts`:
```typescript
export * from "./RichText.js";
```

**Step 3: Update any component files with relative imports**

Search and replace pattern in `.tsx` files:
- `from "./` → needs review to add `.js`
- `from "../` → needs review to add `.js`

**Step 4: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in content directory

---

## Task 10: Update Datetime Components

**Files:**
- Modify: `packages/fantasion-ui/datetime/index.ts`
- Modify: `packages/fantasion-ui/datetime/*.tsx` files with relative imports

**Step 1: Update datetime/index.ts**

```typescript
export * from "./DateLabel.js";
export * from "./DateRange.js";
export * from "./DateTimeLabel.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in datetime directory

---

## Task 11: Update Forms Components

**Files:**
- Modify: `packages/fantasion-ui/forms/index.ts`
- Modify: All subdirectory index files
- Modify: Component files with relative imports

**Step 1: Update forms/index.ts**

```typescript
export * from "./Form/index.js";
export * from "./FormCheck/index.js";
export * from "./FormControl/index.js";
```

**Step 2: Update each subdirectory index.ts (Form, FormCheck, FormControl)**

Pattern:
```typescript
export * from "./<ComponentName>.js";
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in forms directory

---

## Task 12: Update Grid Components

**Files:**
- Modify: `packages/fantasion-ui/grid/index.ts`
- Modify: Subdirectory index files

**Step 1: Update grid/index.ts**

```typescript
export * from "./Col/index.js";
export * from "./Container/index.js";
export * from "./Row/index.js";
export * from "./Stack/index.js";
```

**Step 2: Update each subdirectory index.ts**

Pattern:
```typescript
export * from "./<ComponentName>.js";
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in grid directory

---

## Task 13: Update Lists Components

**Files:**
- Modify: `packages/fantasion-ui/lists/index.ts`
- Modify: Subdirectory index files

**Step 1: Update lists/index.ts**

```typescript
export * from "./ListGroup/index.js";
export * from "./Pagination/index.js";
export * from "./Table/index.js";
export * from "./TitledList/index.js";
```

**Step 2: Update each subdirectory index.ts**

Pattern:
```typescript
export * from "./<ComponentName>.js";
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in lists directory

---

## Task 14: Update Location Components

**Files:**
- Modify: `packages/fantasion-ui/location/index.ts`
- Modify: `packages/fantasion-ui/location/*.tsx` files with relative imports

**Step 1: Update location/index.ts**

```typescript
export * from "./Address.js";
export * from "./Location.js";
export * from "./LocationAddress.js";
export * from "./LocationFuzzyName.js";
export * from "./LocationMap.js";

// Location-related utility
export const joinAddressValue = (value: (string | undefined)[] | string | undefined, delimiter = " ") =>
	Array.isArray(value) ? value.filter(Boolean).join(delimiter) : value;

// Location types (used by transport and other domains)
export type LocationType = {
	name?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
	country?: { name?: string };
	fuzzyName?: string | null;
	lat?: number;
	lng?: number;
	[key: string]: unknown;
};
```

**Step 2: Update component imports**

In `Address.tsx`:
```typescript
import { joinAddressValue } from "./index.js";
```

In `LocationAddress.tsx`:
```typescript
import { AddressLine } from "./Address.js";
import type { LocationType } from "./index.js";
```

In `LocationMap.tsx`:
```typescript
import { joinAddressValue, type LocationType } from "./index.js";
```

In `LocationFuzzyName.tsx`:
```typescript
import { IconLabel } from "../content/IconLabel/index.js";
import type { LocationType } from "./index.js";
```

In `Location.tsx`:
```typescript
import { LocationAddress } from "./LocationAddress.js";
import type { LocationType } from "./index.js";
```

**Step 3: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in location directory

---

## Task 15: Update Media Components

**Files:**
- Modify: `packages/fantasion-ui/media/index.ts`
- Modify: All `.tsx` files in media with relative imports

**Step 1: Update media/index.ts to use wildcard exports**

```typescript
export * from "./LightBox.js";
export * from "./LocalPhoto.js";
export * from "./MediaObject.js";
export * from "./SlideShowGallery.js";
export * from "./ThumbGallery.js";
export * from "./hooks.js";
export * from "./types.js";
```

**Step 2: Update MediaObject.tsx**

```typescript
"use client";

import classnames from "classnames";
import { LocalPhoto } from "./LocalPhoto.js";
import type { MediaObjectType, PreviewCommonProps } from "./types.js";
import styles from "./media.module.scss";

// ... rest unchanged
```

**Step 3: Update ThumbGallery.tsx**

```typescript
import { LightBox } from "./LightBox.js";
import { MediaObject } from "./MediaObject.js";
import { isValidMedia } from "./MediaObject.js";
import type { IconComponent, MediaObjectType } from "./types.js";
import styles from "./media.module.scss";

// ... rest unchanged
```

**Step 4: Update LightBox.tsx**

```typescript
import { MediaObject } from "./MediaObject.js";
import type { IconComponent, MediaObjectType } from "./types.js";
import styles from "./media.module.scss";

// ... rest unchanged
```

**Step 5: Update SlideShowGallery.tsx**

```typescript
import { GALLERY_ROTATION_INTERVAL_MS, useRotatingIndex } from "./hooks.js";
import type { MediaObjectType } from "./types.js";

// ... rest unchanged
```

**Step 6: Update LocalPhoto.tsx if it has relative imports**

Check and update any relative imports to add `.js` extensions.

**Step 7: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in media directory

---

## Task 16: Update Money Components

**Files:**
- Modify: `packages/fantasion-ui/money/index.ts`
- Modify: `packages/fantasion-ui/money/*.tsx` with relative imports

**Step 1: Update money/index.ts**

```typescript
export * from "./Money.js";
export * from "./PriceLabel.js";

// Keep utility functions and types
export const formatMoney = (amount: MoneyAmount | undefined | null) => {
	if (!amount) return "";
	return `${amount.amount} ${amount.currency}`;
};

export type MoneyAmount = {
	amount: number;
	currency: string;
};
```

**Step 2: Update Money.tsx**

```typescript
import { formatMoney, type MoneyAmount } from "./index.js";

// ... rest unchanged
```

**Step 3: Update PriceLabel.tsx**

```typescript
import { IconLabel } from "../content/IconLabel/index.js";

// ... rest unchanged
```

**Step 4: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in money directory

---

## Task 17: Update Navbar Components

**Files:**
- Modify: `packages/fantasion-ui/Navbar/index.ts`

**Step 1: Update with wildcard export**

```typescript
export * from "./Navbar.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Navbar directory

---

## Task 18: Update Navigation Components

**Files:**
- Modify: `packages/fantasion-ui/navigation/index.ts`
- Modify: All subdirectory index files
- Modify: Component files with relative imports

**Step 1: Update navigation/index.ts**

```typescript
export * from "./Nav/index.js";
export * from "./Spinner/index.js";
```

**Step 2: Update Nav/index.ts**

```typescript
export * from "./Nav.js";
```

**Step 3: Update Nav.stories.tsx**

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Nav, NavButton, NavItem, NavLink } from "./Nav.js";

// ... rest unchanged
```

**Step 4: Update Spinner/index.ts**

```typescript
export * from "./Spinner.js";
```

**Step 5: Update Spinner.stories.tsx**

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner.js";

// ... rest unchanged
```

**Step 6: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in navigation directory

---

## Task 19: Update Orders Components

**Files:**
- Modify: `packages/fantasion-ui/orders/index.ts`

**Step 1: Update with wildcard export**

```typescript
export * from "./OrderPrice.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in orders directory

---

## Task 20: Update Overlays Components

**Files:**
- Modify: `packages/fantasion-ui/overlays/index.ts`
- Modify: All subdirectory index files

**Step 1: Update overlays/index.ts**

```typescript
export * from "./Modal/index.js";
export * from "./Offcanvas/index.js";
export * from "./Popover/index.js";
export * from "./Tooltip/index.js";
```

**Step 2: Update each subdirectory index.ts**

Pattern for Modal/index.ts, Offcanvas/index.ts, Popover/index.ts, Tooltip/index.ts:
```typescript
export * from "./<ComponentName>.js";
```

**Step 3: Update story files**

For any `.stories.tsx` files, update imports to add `.js` extensions.

**Step 4: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in overlays directory

---

## Task 21: Update Profile Components

**Files:**
- Modify: `packages/fantasion-ui/profile/index.ts`

**Step 1: Update with wildcard export**

```typescript
export * from "./UserLink.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in profile directory

---

## Task 22: Update Signups Components

**Files:**
- Modify: `packages/fantasion-ui/signups/index.ts`

**Step 1: Update with wildcard export**

```typescript
export * from "./OrderSignupCard.js";
```

**Step 2: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in signups directory

---

## Task 23: Update Toast Components

**Files:**
- Modify: `packages/fantasion-ui/Toast/index.ts`
- Modify: `packages/fantasion-ui/Toast/Toast.stories.tsx`
- Modify: `packages/fantasion-ui/Toast/Toast.tsx`

**Step 1: Update Toast/index.ts**

```typescript
export * from "./Toast.js";
```

**Step 2: Update Toast.stories.tsx**

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastBody, ToastContainer, ToastHeader } from "./Toast.js";

// ... rest unchanged
```

**Step 3: Update Toast.tsx if needed**

```typescript
import styles from "./Toast.module.scss";

// ... rest unchanged (SCSS imports don't need .js extension)
```

**Step 4: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in Toast directory

---

## Task 24: Update Transport Components

**Files:**
- Modify: `packages/fantasion-ui/transport/index.ts`
- Modify: Component files with relative imports

**Step 1: Update transport/index.ts**

```typescript
export * from "./BusSpinner.js";
export * from "./ItineraryStepStatus.js";
```

**Step 2: Update BusSpinner.tsx**

```typescript
import { Spinner } from "../navigation/Spinner/index.js";

// ... rest unchanged
```

**Step 3: Update ItineraryStepStatus.tsx**

```typescript
import { IconLabel } from "../content/IconLabel/index.js";

// ... rest unchanged
```

**Step 4: Verify**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No errors in transport directory

---

## Task 25: Final Verification

**Step 1: Run full type check**

Run: `cd packages/fantasion-ui && pnpm type-check`
Expected: No TypeScript errors

**Step 2: Run build**

Run: `cd packages/fantasion-ui && pnpm build`
Expected: Build succeeds

**Step 3: Start Storybook**

Run: `cd packages/fantasion-ui && pnpm storybook`
Expected: Storybook starts without import errors

**Step 4: Commit changes**

```bash
cd packages/fantasion-ui
git add -A
git commit -m "refactor: add .js extensions to all imports for Storybook compatibility

- Add .js extensions to ~105 import statements
- Replace exhaustive exports with wildcard exports (export *)
- Update tsconfig.json to require extensions (allowImportingTsExtensions: false)
- Update include pattern to match new directory structure
- Ensure ESM compatibility with Storybook"
```

---

## Notes

- **Extension Convention**: Use `.js` for TypeScript files (`.ts`/`.tsx`) when targeting ESM. TypeScript compiler handles this automatically.
- **SCSS Imports**: Do NOT add extensions to `.scss` imports - they use `.module.scss` already.
- **Wildcard Exports**: Using `export * from "./File.js"` is cleaner than exhaustive named exports and automatically re-exports everything.
- **Index Files**: Keep `index.ts` files as aggregation points but simplify them to use wildcard exports.
