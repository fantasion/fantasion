# Fantasion UI Package Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Flatten fantasion-ui component structure by moving all components from `components/` subdirectory to package root, organize by features (buttons, lists, overlays), and split media-components.tsx into individual files.

**Architecture:** Move from `packages/fantasion-ui/components/Button/` to `packages/fantasion-ui/Button/`, group related components into feature directories (buttons/, lists/, overlays/), and decompose aggregated media components into separate, focused files.

**Tech Stack:** TypeScript, React, SCSS Modules, Vite

---

## Task 1: Split media-components.tsx into individual files

**Files:**
- Read: `packages/fantasion-ui/components/media/media-components.tsx`
- Create: `packages/fantasion-ui/components/media/SlideShowGallery.tsx`
- Create: `packages/fantasion-ui/components/media/ThumbGallery.tsx`
- Create: `packages/fantasion-ui/components/media/PageTopGallery.tsx`
- Create: `packages/fantasion-ui/components/media/LightBox.tsx`
- Create: `packages/fantasion-ui/components/media/MediaObject.tsx`
- Create: `packages/fantasion-ui/components/media/LocalPhoto.tsx`
- Create: `packages/fantasion-ui/components/media/types.ts`
- Create: `packages/fantasion-ui/components/media/hooks.ts`
- Modify: `packages/fantasion-ui/components/media/index.ts`
- Delete: `packages/fantasion-ui/components/media/media-components.tsx`

**Step 1: Create types.ts with shared types**

Create `packages/fantasion-ui/components/media/types.ts`:

```typescript
import type React from "react";

export type IconComponent = React.ComponentType;

export type LocalPhoto = Record<string, string>;

export type MediaObjectType = {
	id?: number | string;
	localPhoto?: LocalPhoto;
	[key: string]: unknown;
};

export type PreviewCommonProps = {
	localPhoto: LocalPhoto;
	size: string;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
};
```

**Step 2: Create hooks.ts with useRotatingIndex**

Create `packages/fantasion-ui/components/media/hooks.ts`:

```typescript
import { useEffect, useState } from "react";

export const GALLERY_ROTATION_INTERVAL_MS = 6000;

export const useRotatingIndex = (items: unknown[], intervalMs: number): [number] => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (items.length === 0) return;
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % items.length);
		}, intervalMs);
		return () => clearInterval(interval);
	}, [items.length, intervalMs]);

	return [index];
};
```

**Step 3: Create LocalPhoto.tsx**

Create `packages/fantasion-ui/components/media/LocalPhoto.tsx`:

```typescript
"use client";

import classnames from "classnames";
import { useCallback } from "react";
import type { LocalPhoto as LocalPhotoType, PreviewCommonProps } from "./types";
import styles from "./media.module.scss";

const PreviewImage = ({ localPhoto, size, className, onClick }: PreviewCommonProps) => {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (onClick && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		},
		[onClick],
	);

	const isInteractive = Boolean(onClick);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/noNoninteractiveElementInteractions: Conditionally interactive element based on onClick prop
		<div
			className={className}
			onClick={onClick}
			role={isInteractive ? "button" : undefined}
			tabIndex={isInteractive ? 0 : undefined}
			onKeyDown={isInteractive ? handleKeyDown : undefined}
		>
			<img className={styles.galleryImage} alt="" src={localPhoto[size]} width={200} height={200} />
		</div>
	);
};

const PreviewDiv = ({ className, localPhoto, size, onClick }: PreviewCommonProps) => {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (onClick && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		},
		[onClick],
	);

	const isInteractive = Boolean(onClick);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/noNoninteractiveElementInteractions: Conditionally interactive element based on onClick prop
		<div
			className={classnames(className, styles.previewDiv)}
			style={{ backgroundImage: `url(${localPhoto[size]})` }}
			onClick={onClick}
			role={isInteractive ? "button" : undefined}
			tabIndex={isInteractive ? 0 : undefined}
			onKeyDown={isInteractive ? handleKeyDown : undefined}
		/>
	);
};

export { PreviewDiv };

type LocalPhotoProps = {
	previewComponent?: React.ComponentType<
		PreviewCommonProps & { className?: string; onClick?: React.MouseEventHandler<HTMLElement> }
	>;
	localPhoto: LocalPhotoType;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
	size?: string;
};

export const LocalPhoto = ({
	previewComponent: PreviewComponent = PreviewImage,
	localPhoto,
	className,
	onClick,
	size = "galleryDecoration",
}: LocalPhotoProps) => <PreviewComponent localPhoto={localPhoto} className={className} onClick={onClick} size={size} />;
```

**Step 4: Create MediaObject.tsx**

Create `packages/fantasion-ui/components/media/MediaObject.tsx`:

```typescript
"use client";

import classnames from "classnames";
import { LocalPhoto } from "./LocalPhoto";
import type { MediaObjectType, PreviewCommonProps } from "./types";
import styles from "./media.module.scss";

export type MediaObjectProps = {
	className?: string;
	mediaObject: MediaObjectType;
	onDetail?: (mediaObject: MediaObjectType, e: React.MouseEvent<HTMLElement>) => void;
	previewComponent?: React.ComponentType<PreviewCommonProps>;
	size?: string;
};

export const MediaObject = ({ className, mediaObject, onDetail, previewComponent, size }: MediaObjectProps) => {
	const onClick = onDetail ? (e: React.MouseEvent<HTMLElement>) => onDetail(mediaObject, e) : undefined;
	const composedClass = classnames({ [styles.interactiveThumb]: Boolean(onDetail) }, className);
	if (mediaObject.localPhoto) {
		return (
			<LocalPhoto
				previewComponent={previewComponent}
				className={composedClass}
				localPhoto={mediaObject.localPhoto}
				onClick={onClick}
				size={size}
			/>
		);
	}
	return null;
};

export const isValidMedia = (mediaObject: MediaObjectType) => Boolean(mediaObject.localPhoto);
```

**Step 5: Create LightBox.tsx**

Create `packages/fantasion-ui/components/media/LightBox.tsx`:

```typescript
"use client";

import classnames from "classnames";
import { useEffect, useRef } from "react";
import { MediaObject } from "./MediaObject";
import type { IconComponent, MediaObjectType } from "./types";
import styles from "./media.module.scss";

type ButtonProps = {
	className?: string;
	disabled?: boolean;
	onClick?: (() => void) | undefined;
	title?: string;
	children: React.ReactNode;
};

const Button = ({ className, disabled, onClick, title, children }: ButtonProps) => (
	<button className={className} disabled={disabled} onClick={onClick} title={title} type="button">
		{children}
	</button>
);

type ModalProps = {
	centered?: boolean;
	className?: string;
	fullscreen?: boolean;
	onClick?: React.MouseEventHandler<HTMLElement>;
	onEntered?: () => void;
	onHide: () => void;
	show: boolean;
	size?: string;
	children: React.ReactNode;
};

const Modal = ({ className, onClick, onEntered, onHide, show, children }: ModalProps) => {
	useEffect(() => {
		if (show && onEntered) {
			onEntered();
		}
	}, [show, onEntered]);

	if (!show) return null;

	return (
		<div className={classnames("modal", className)} onClick={onClick} style={{ display: "block" }}>
			<div className="modal-dialog modal-dialog-centered modal-fullscreen">
				<div className="modal-content" onClick={onClick}>
					{children}
				</div>
			</div>
		</div>
	);
};

type LightBoxButtonProps = {
	className?: string;
	icon: IconComponent;
	onClick?: (() => void) | null;
	title?: string;
};

const LightBoxButton = ({ className, icon: Icon, onClick, title }: LightBoxButtonProps) => (
	<Button
		className={classnames(styles.lightboxButton, className)}
		disabled={!onClick}
		onClick={onClick || undefined}
		title={title}
	>
		<Icon />
	</Button>
);

export type LightBoxProps = {
	mediaObject: MediaObjectType | null;
	onNext?: (() => void) | null;
	onPrev?: (() => void) | null;
	onClose: () => void;
	show: boolean;
	closeIcon: IconComponent;
	prevIcon: IconComponent;
	nextIcon: IconComponent;
	closeLabel?: string;
	prevLabel?: string;
	nextLabel?: string;
};

export const LightBox = ({
	mediaObject,
	onNext,
	onPrev,
	onClose,
	show,
	closeIcon,
	prevIcon,
	nextIcon,
	closeLabel = "Close",
	prevLabel = "Previous",
	nextLabel = "Next",
}: LightBoxProps) => {
	const container = useRef<HTMLDivElement | null>(null);
	const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains("modal-content")) {
			onClose();
		}
	};

	const handleOpenFocus = () => container.current?.focus();
	const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "ArrowLeft" && onPrev) {
			onPrev();
		}
		if (e.key === "ArrowRight" && onNext) {
			onNext();
		}
	};
	return (
		<Modal
			centered={true}
			className={styles.lightbox}
			fullscreen={true}
			onClick={handleBackdropClick}
			onEntered={handleOpenFocus}
			onHide={onClose}
			show={show}
			size="xl"
		>
			{/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/noNoninteractiveElementInteractions: Keyboard event container for lightbox navigation */}
			<div className={styles.lightboxContainer} onKeyUp={handleKeyUp} ref={container} tabIndex={-1}>
				<LightBoxButton className={styles.lightboxClose} icon={closeIcon} onClick={onClose} title={closeLabel} />
				<LightBoxButton className={styles.lightboxPrev} icon={prevIcon} onClick={onPrev} title={prevLabel} />
				<LightBoxButton className={styles.lightboxNext} icon={nextIcon} onClick={onNext} title={nextLabel} />
				{mediaObject ? <MediaObject mediaObject={mediaObject} size="galleryDetail" /> : null}
			</div>
		</Modal>
	);
};
```

**Step 6: Create SlideShowGallery.tsx**

Create `packages/fantasion-ui/components/media/SlideShowGallery.tsx`:

```typescript
"use client";

import classnames from "classnames";
import { forwardRef } from "react";
import { GALLERY_ROTATION_INTERVAL_MS, useRotatingIndex } from "./hooks";
import { MediaObject } from "./MediaObject";
import { isValidMedia } from "./MediaObject";
import type { MediaObjectType, PreviewCommonProps } from "./types";
import styles from "./media.module.scss";

export type SlideShowGalleryProps = {
	as?: React.ElementType;
	className?: string;
	media?: MediaObjectType[];
	previewComponent?: React.ComponentType<PreviewCommonProps>;
	size?: string;
	square?: boolean;
	onDetail?: (mediaObject: MediaObjectType, e: React.MouseEvent<HTMLElement>) => void;
} & Record<string, unknown>;

const ReflessSlideShowGallery = (
	{
		as: Component = "div",
		className,
		media,
		previewComponent,
		size = "galleryDecoration",
		square,
		onDetail,
		...rest
	}: SlideShowGalleryProps,
	ref: React.Ref<HTMLElement>,
) => {
	const validMedia = (media ?? []).filter(isValidMedia);
	const [activeIndex] = useRotatingIndex(validMedia, GALLERY_ROTATION_INTERVAL_MS);
	return (
		<Component
			{...rest}
			className={classnames(className, styles.slideShow, {
				[styles.squareLayout]: square,
			})}
			ref={ref}
		>
			{validMedia.map((mediaObject: MediaObjectType, index: number) => (
				<MediaObject
					className={classnames(styles.slideShowThumb, {
						[styles.slideShowCurrent]: activeIndex === index,
					})}
					key={mediaObject.id ?? index}
					mediaObject={mediaObject}
					onDetail={onDetail}
					previewComponent={previewComponent}
					size={size}
				/>
			))}
		</Component>
	);
};

export const SlideShowGallery = forwardRef<HTMLElement, SlideShowGalleryProps>(ReflessSlideShowGallery);
```

**Step 7: Create ThumbGallery.tsx**

Create `packages/fantasion-ui/components/media/ThumbGallery.tsx`:

```typescript
"use client";

import classnames from "classnames";
import { useState } from "react";
import { LightBox } from "./LightBox";
import { MediaObject } from "./MediaObject";
import { isValidMedia } from "./MediaObject";
import type { IconComponent, MediaObjectType } from "./types";
import styles from "./media.module.scss";

export type ThumbGalleryProps = {
	className?: string;
	media: MediaObjectType[];
	lightbox?: boolean;
	closeIcon?: IconComponent;
	prevIcon?: IconComponent;
	nextIcon?: IconComponent;
	closeLabel?: string;
	prevLabel?: string;
	nextLabel?: string;
};

export const ThumbGallery = ({
	className,
	media,
	lightbox = true,
	closeIcon,
	prevIcon,
	nextIcon,
	closeLabel,
	prevLabel,
	nextLabel,
}: ThumbGalleryProps) => {
	const [showDetail, setShowDetail] = useState(false);
	const [detail, setDetail] = useState<MediaObjectType | null>(null);
	const createLightboxOpen = (mediaObject: MediaObjectType) => () => {
		setDetail(mediaObject);
		setShowDetail(true);
	};
	const currentIndex = detail ? media.indexOf(detail) : -1;
	const nextObj = currentIndex >= 0 ? media[currentIndex + 1] : undefined;
	const prevObj = currentIndex >= 0 ? media[currentIndex - 1] : undefined;
	const handleClose = () => setShowDetail(false);
	const handleNext = nextObj ? () => setDetail(nextObj) : null;
	const handlePrev = prevObj ? () => setDetail(prevObj) : null;
	return (
		<>
			{lightbox && closeIcon && prevIcon && nextIcon && (
				<LightBox
					mediaObject={detail}
					onClose={handleClose}
					onNext={handleNext}
					onPrev={handlePrev}
					show={showDetail}
					closeIcon={closeIcon}
					prevIcon={prevIcon}
					nextIcon={nextIcon}
					closeLabel={closeLabel}
					prevLabel={prevLabel}
					nextLabel={nextLabel}
				/>
			)}
			<div className={classnames(styles.thumbGallery, className)}>
				{media.filter(isValidMedia).map((mediaObject: MediaObjectType, index: number) => (
					<MediaObject
						className={styles.thumb}
						key={mediaObject.id ?? index}
						mediaObject={mediaObject}
						size="galleryDecoration"
						onDetail={createLightboxOpen(mediaObject)}
					/>
				))}
			</div>
		</>
	);
};
```

**Step 8: Create PageTopGallery.tsx**

Create `packages/fantasion-ui/components/media/PageTopGallery.tsx`:

```typescript
"use client";

import { PreviewDiv } from "./LocalPhoto";
import { SlideShowGallery } from "./SlideShowGallery";
import type { MediaObjectType } from "./types";
import styles from "./media.module.scss";

type ColProps = {
	className?: string;
	xl?: number;
	children: React.ReactNode;
};

const Col = ({ className, children }: ColProps) => <div className={className}>{children}</div>;

export type PageTopGalleryProps = {
	media: MediaObjectType[];
	size?: string;
};

export const PageTopGallery = ({ media, size = "galleryDetail" }: PageTopGalleryProps) => {
	if (media.length === 0) {
		return null;
	}
	return (
		<Col className={styles.pageTopGalleryContainer} xl={5}>
			<SlideShowGallery className={styles.pageTopGallery} media={media} previewComponent={PreviewDiv} size={size} />
		</Col>
	);
};
```

**Step 9: Update media/index.ts**

Modify `packages/fantasion-ui/components/media/index.ts`:

```typescript
export { SlideShowGallery, type SlideShowGalleryProps } from "./SlideShowGallery";
export { ThumbGallery, type ThumbGalleryProps } from "./ThumbGallery";
export { PageTopGallery, type PageTopGalleryProps } from "./PageTopGallery";
export { LightBox, type LightBoxProps } from "./LightBox";
export { MediaObject, type MediaObjectProps, isValidMedia } from "./MediaObject";
export { LocalPhoto, PreviewDiv } from "./LocalPhoto";
export { type IconComponent, type MediaObjectType, type LocalPhoto as LocalPhotoType, type PreviewCommonProps } from "./types";
export { useRotatingIndex, GALLERY_ROTATION_INTERVAL_MS } from "./hooks";
```

**Step 10: Delete media-components.tsx**

```bash
git rm packages/fantasion-ui/components/media/media-components.tsx
```

**Step 11: Verify media components work**

Run: `pnpm run --filter @fantasion/ui build`
Expected: Build succeeds without errors

**Step 12: Commit media split**

```bash
git add packages/fantasion-ui/components/media/
git commit -m "refactor: split media-components.tsx into individual files

- Extract SlideShowGallery, ThumbGallery, PageTopGallery into separate files
- Create shared types.ts and hooks.ts for media components
- Split LocalPhoto, MediaObject, and LightBox into focused modules
- Improve maintainability and code organization"
```

---

## Task 2: Create buttons feature directory

**Files:**
- Create: `packages/fantasion-ui/components/buttons/index.ts`
- Move: `packages/fantasion-ui/components/Button/*` → `packages/fantasion-ui/components/buttons/Button/`
- Move: `packages/fantasion-ui/components/CopyButton/*` → `packages/fantasion-ui/components/buttons/CopyButton/`
- Move: `packages/fantasion-ui/components/ButtonGroup/*` → `packages/fantasion-ui/components/buttons/ButtonGroup/`
- Modify: `packages/fantasion-ui/components/index.ts`

**Step 1: Create buttons directory and move components**

```bash
mkdir -p packages/fantasion-ui/components/buttons
git mv packages/fantasion-ui/components/Button packages/fantasion-ui/components/buttons/Button
git mv packages/fantasion-ui/components/CopyButton packages/fantasion-ui/components/buttons/CopyButton
git mv packages/fantasion-ui/components/ButtonGroup packages/fantasion-ui/components/buttons/ButtonGroup
```

**Step 2: Create buttons/index.ts barrel**

Create `packages/fantasion-ui/components/buttons/index.ts`:

```typescript
export {
	Button,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
} from "./Button/index";
export {
	CopyButton,
	type CopyButtonProps,
	InteractiveButton,
	type InteractiveButtonProps,
} from "./CopyButton/index";
export {
	ButtonGroup,
	type ButtonGroupProps,
	ButtonToolbar,
	type ButtonToolbarProps,
} from "./ButtonGroup/index";
```

**Step 3: Update main index.ts**

Modify `packages/fantasion-ui/components/index.ts` - replace the three button-related sections with:

```typescript
// Buttons & Badges
export * from "./buttons";
```

**Step 4: Verify build**

Run: `pnpm run --filter @fantasion/ui build`
Expected: Build succeeds

**Step 5: Commit buttons feature**

```bash
git add packages/fantasion-ui/components/buttons/ packages/fantasion-ui/components/index.ts
git commit -m "refactor: create buttons feature directory

- Group Button, CopyButton, and ButtonGroup under buttons/
- Create feature barrel export in buttons/index.ts
- Simplify main component index"
```

---

## Task 3: Create lists feature directory

**Files:**
- Create: `packages/fantasion-ui/components/lists/index.ts`
- Move: `packages/fantasion-ui/components/ListGroup/*` → `packages/fantasion-ui/components/lists/ListGroup/`
- Move: `packages/fantasion-ui/components/Accordion/*` → `packages/fantasion-ui/components/lists/Accordion/`
- Modify: `packages/fantasion-ui/components/index.ts`

**Step 1: Create lists directory and move components**

```bash
mkdir -p packages/fantasion-ui/components/lists
git mv packages/fantasion-ui/components/ListGroup packages/fantasion-ui/components/lists/ListGroup
git mv packages/fantasion-ui/components/Accordion packages/fantasion-ui/components/lists/Accordion
```

**Step 2: Create lists/index.ts barrel**

Create `packages/fantasion-ui/components/lists/index.ts`:

```typescript
export {
	Accordion,
	AccordionBody,
	type AccordionBodyProps,
	AccordionButton,
	type AccordionButtonProps,
	AccordionCollapse,
	type AccordionCollapseProps,
	AccordionHeader,
	type AccordionHeaderProps,
	AccordionItem,
	type AccordionItemProps,
	type AccordionProps,
} from "./Accordion/index";
export {
	ListGroup,
	ListGroupItem,
	type ListGroupItemProps,
	type ListGroupProps,
} from "./ListGroup/index";
```

**Step 3: Update main index.ts**

Modify `packages/fantasion-ui/components/index.ts` - replace Accordion and ListGroup sections with:

```typescript
// Lists
export * from "./lists";
```

**Step 4: Verify build**

Run: `pnpm run --filter @fantasion/ui build`
Expected: Build succeeds

**Step 5: Commit lists feature**

```bash
git add packages/fantasion-ui/components/lists/ packages/fantasion-ui/components/index.ts
git commit -m "refactor: create lists feature directory

- Group Accordion and ListGroup under lists/
- Create feature barrel export in lists/index.ts"
```

---

## Task 4: Create overlays feature directory

**Files:**
- Create: `packages/fantasion-ui/components/overlays/index.ts`
- Move: `packages/fantasion-ui/components/Overlay/*` → `packages/fantasion-ui/components/overlays/Overlay/`
- Move: `packages/fantasion-ui/components/Modal/*` → `packages/fantasion-ui/components/overlays/Modal/`
- Move: `packages/fantasion-ui/components/Offcanvas/*` → `packages/fantasion-ui/components/overlays/Offcanvas/`
- Move: `packages/fantasion-ui/components/Tooltip/*` → `packages/fantasion-ui/components/overlays/Tooltip/`
- Modify: `packages/fantasion-ui/components/index.ts`

**Step 1: Create overlays directory and move components**

```bash
mkdir -p packages/fantasion-ui/components/overlays
git mv packages/fantasion-ui/components/Overlay packages/fantasion-ui/components/overlays/Overlay
git mv packages/fantasion-ui/components/Modal packages/fantasion-ui/components/overlays/Modal
git mv packages/fantasion-ui/components/Offcanvas packages/fantasion-ui/components/overlays/Offcanvas
git mv packages/fantasion-ui/components/Tooltip packages/fantasion-ui/components/overlays/Tooltip
```

**Step 2: Create overlays/index.ts barrel**

Create `packages/fantasion-ui/components/overlays/index.ts`:

```typescript
export {
	Modal,
	ModalBody,
	type ModalBodyProps,
	ModalFooter,
	type ModalFooterProps,
	ModalHeader,
	type ModalHeaderProps,
	type ModalProps,
	type ModalSize,
	ModalTitle,
	type ModalTitleProps,
} from "./Modal/index";
export {
	Offcanvas,
	OffcanvasBody,
	type OffcanvasBodyProps,
	OffcanvasHeader,
	type OffcanvasHeaderProps,
	type OffcanvasPlacement,
	type OffcanvasProps,
	OffcanvasTitle,
	type OffcanvasTitleProps,
} from "./Offcanvas/index";
export {
	Dropdown,
	DropdownDivider,
	type DropdownDividerProps,
	DropdownHeader,
	type DropdownHeaderProps,
	DropdownItem,
	type DropdownItemProps,
	DropdownMenu,
	type DropdownMenuProps,
	type DropdownProps,
	DropdownToggle,
	type DropdownToggleProps,
	Popover,
	PopoverBody,
	type PopoverBodyProps,
	PopoverHeader,
	type PopoverHeaderProps,
	type PopoverPlacement,
	type PopoverProps,
} from "./Overlay/index";
export {
	Overlay,
	type OverlayProps,
	Tooltip,
	TooltipContent,
	type TooltipContentProps,
	type TooltipPlacement,
	type TooltipProps,
	type TooltipVariant,
} from "./Tooltip/index";
```

**Step 3: Update main index.ts**

Modify `packages/fantasion-ui/components/index.ts` - replace Modal, Offcanvas, Overlay, and Tooltip sections with:

```typescript
// Overlays & Modals
export * from "./overlays";
```

**Step 4: Verify build**

Run: `pnpm run --filter @fantasion/ui build`
Expected: Build succeeds

**Step 5: Commit overlays feature**

```bash
git add packages/fantasion-ui/components/overlays/ packages/fantasion-ui/components/index.ts
git commit -m "refactor: create overlays feature directory

- Group Modal, Offcanvas, Overlay, and Tooltip under overlays/
- Create feature barrel export in overlays/index.ts"
```

---

## Task 5: Flatten component structure (move from components/ to root)

**Files:**
- Move: All directories in `packages/fantasion-ui/components/*` → `packages/fantasion-ui/*`
- Modify: `packages/fantasion-ui/index.ts`
- Delete: `packages/fantasion-ui/components/` directory

**Step 1: Move all component directories to package root**

```bash
# Move feature directories
for dir in packages/fantasion-ui/components/*/; do
  dirname=$(basename "$dir")
  git mv "$dir" "packages/fantasion-ui/$dirname"
done
```

**Step 2: Update all import paths in moved files**

For each component directory, update internal imports from `../ComponentName` to `./ComponentName` or appropriate relative paths.

This step requires updating imports in:
- `packages/fantasion-ui/buttons/CopyButton/CopyButton.tsx` - Update `../Button` to `../Button/Button`
- `packages/fantasion-ui/media/*.tsx` - All files already use relative imports, should work
- All barrel index files should work as-is since they use relative imports

**Step 3: Update main package index.ts**

Modify `packages/fantasion-ui/index.ts`:

```typescript
// Re-export all components from their new locations
export * from "./Alert/index";
export * from "./Badge/index";
export * from "./Breadcrumb/index";
export * from "./buttons";
export * from "./Card/index";
export * from "./Carousel/index";
export * from "./Collapse/index";
export * from "./Container/index";
export * from "./content";
export * from "./datetime";
export * from "./Form/index";
export * from "./Grid/index";
export * from "./InputGroup/index";
export * from "./lists";
export * from "./location";
export * from "./media";
export * from "./money";
export * from "./Nav/index";
export * from "./Navbar/index";
export * from "./NavDropdown/index";
export * from "./orders";
export * from "./overlays";
export * from "./profile";
export * from "./signups";
export * from "./Spinner/index";
export * from "./Toast/index";
export * from "./transport";
```

**Step 4: Delete empty components directory**

```bash
rmdir packages/fantasion-ui/components
```

**Step 5: Update vite.config.ts if needed**

Check if `packages/fantasion-ui/vite.config.ts` references the components directory. Update if necessary.

**Step 6: Verify build**

Run: `pnpm run --filter @fantasion/ui build`
Expected: Build succeeds without errors

**Step 7: Run TypeScript check**

Run: `pnpm run --filter @fantasion/ui type-check` (if type-check script exists)
Expected: No type errors

**Step 8: Commit flattened structure**

```bash
git add -A packages/fantasion-ui/
git commit -m "refactor: flatten fantasion-ui structure by removing components/ directory

- Move all components from components/ to package root
- Update import paths throughout the package
- Simplify package structure for better discoverability"
```

---

## Task 6: Update fantasion-web imports

**Files:**
- Modify: All files in `packages/fantasion-web/` that import from `@fantasion/ui`

**Step 1: Search for all @fantasion/ui imports**

```bash
grep -r "from \"@fantasion/ui\"" packages/fantasion-web/ --include="*.tsx" --include="*.ts" | wc -l
```

Expected: Find all import locations

**Step 2: Verify imports still work**

Since we're using barrel exports through `packages/fantasion-ui/index.ts`, all imports from `@fantasion/ui` should continue to work without changes.

Run: `cd packages/fantasion-web && pnpm run type-check`
Expected: No type errors

**Step 3: Build fantasion-web**

Run: `pnpm run build`
Expected: Build succeeds

**Step 4: Run linter**

Run: `cd packages/fantasion-web && pnpm run lint`
Expected: No lint errors

**Step 5: Commit verification (if any changes needed)**

If any imports needed updating:
```bash
git add packages/fantasion-web/
git commit -m "fix: update @fantasion/ui imports after structure change"
```

---

## Task 7: Final verification and cleanup

**Files:**
- Verify: All files build correctly
- Verify: No broken imports
- Verify: Tests pass (if any)

**Step 1: Clean build**

```bash
rm -rf packages/fantasion-ui/dist
pnpm run --filter @fantasion/ui build
```

Expected: Clean build succeeds

**Step 2: Build entire monorepo**

```bash
pnpm run build
```

Expected: Both packages build successfully

**Step 3: Check for any TODO or FIXME comments added**

```bash
grep -r "TODO\|FIXME" packages/fantasion-ui/ --include="*.tsx" --include="*.ts"
```

Expected: Only intentional TODOs/FIXMEs remain

**Step 4: Review git status**

```bash
git status
```

Expected: Working directory clean or only intended changes

**Step 5: Final commit if needed**

```bash
git add .
git commit -m "chore: final cleanup after fantasion-ui restructure"
```

---

## Summary

This plan restructures the fantasion-ui package by:

1. Splitting the monolithic `media-components.tsx` into focused, single-responsibility files
2. Creating feature-based directories (`buttons/`, `lists/`, `overlays/`) for related components
3. Flattening the structure by removing the redundant `components/` subdirectory
4. Maintaining backwards compatibility through barrel exports
5. Verifying all builds and imports work correctly

The result is a cleaner, more maintainable structure that follows feature-based organization while keeping individual components properly scoped.
