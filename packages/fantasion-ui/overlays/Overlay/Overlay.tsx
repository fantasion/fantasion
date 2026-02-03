import clsx from "clsx";
import {
	type ButtonHTMLAttributes,
	forwardRef,
	type HTMLAttributes,
	type LiHTMLAttributes,
	type ReactNode,
} from "react";
import styles from "./Overlay.module.scss";

// ============================================
// STYLE MAPS
// ============================================

const placementStyleMap: Record<string, string> = {
	top: "popoverTop",
	bottom: "popoverBottom",
	left: "popoverLeft",
	right: "popoverRight",
};

// ============================================
// DROPDOWN
// ============================================

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.dropdown, className)} {...props}>
		{children}
	</div>
));

Dropdown.displayName = "Dropdown";

// ============================================
// DROPDOWN TOGGLE
// ============================================

export interface DropdownToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(
	({ className, children, ...props }, ref) => (
		<button ref={ref} type="button" className={clsx(styles.dropdownToggle, className)} {...props}>
			{children}
		</button>
	),
);

DropdownToggle.displayName = "DropdownToggle";

// ============================================
// DROPDOWN MENU
// ============================================

export interface DropdownMenuProps extends HTMLAttributes<HTMLUListElement> {
	/** Whether the menu is visible */
	show?: boolean;
	/** Align to end of toggle */
	align?: "start" | "end";
	children: ReactNode;
}

export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
	({ show, align, className, children, ...props }, ref) => (
		<ul
			ref={ref}
			className={clsx(
				styles.dropdownMenu,
				show && styles.dropdownMenuShow,
				align === "end" && styles.dropdownMenuEnd,
				className,
			)}
			{...props}
		>
			{children}
		</ul>
	),
);

DropdownMenu.displayName = "DropdownMenu";

// ============================================
// DROPDOWN ITEM
// ============================================

export interface DropdownItemProps extends LiHTMLAttributes<HTMLLIElement> {
	/** Mark as active */
	active?: boolean;
	/** Mark as disabled */
	disabled?: boolean;
	/** Render as link */
	href?: string;
	/** Click handler */
	onClick?: React.MouseEventHandler<HTMLElement>;
	children: ReactNode;
}

export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
	({ active, disabled, href, onClick, className, children, ...props }, ref) => {
		const itemClasses = clsx(
			styles.dropdownItem,
			active && styles.dropdownItemActive,
			disabled && styles.dropdownItemDisabled,
			className,
		);

		const content = href ? (
			<a href={href} className={itemClasses} onClick={onClick} aria-disabled={disabled ? "true" : undefined}>
				{children}
			</a>
		) : (
			<button type="button" className={itemClasses} onClick={onClick} disabled={disabled}>
				{children}
			</button>
		);

		return (
			<li ref={ref} {...props}>
				{content}
			</li>
		);
	},
);

DropdownItem.displayName = "DropdownItem";

// ============================================
// DROPDOWN DIVIDER
// ============================================

export interface DropdownDividerProps extends HTMLAttributes<HTMLLIElement> {}

export const DropdownDivider = forwardRef<HTMLLIElement, DropdownDividerProps>(({ className, ...props }, ref) => (
	<li ref={ref} className={clsx(styles.dropdownDivider, className)} {...props} />
));

DropdownDivider.displayName = "DropdownDivider";

// ============================================
// DROPDOWN HEADER
// ============================================

export interface DropdownHeaderProps extends HTMLAttributes<HTMLLIElement> {
	children: ReactNode;
}

export const DropdownHeader = forwardRef<HTMLLIElement, DropdownHeaderProps>(
	({ className, children, ...props }, ref) => (
		<li ref={ref} className={clsx(styles.dropdownHeader, className)} {...props}>
			{children}
		</li>
	),
);

DropdownHeader.displayName = "DropdownHeader";

// ============================================
// POPOVER
// ============================================

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
	/** Placement relative to target */
	placement?: PopoverPlacement;
	children: ReactNode;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
	({ placement = "top", className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.popover, styles[placementStyleMap[placement]], className)} {...props}>
			<span className={styles.popoverArrow} />
			{children}
		</div>
	),
);

Popover.displayName = "Popover";

// ============================================
// POPOVER HEADER
// ============================================

export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.popoverHeader, className)} {...props}>
			{children}
		</div>
	),
);

PopoverHeader.displayName = "PopoverHeader";

// ============================================
// POPOVER BODY
// ============================================

export interface PopoverBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.popoverBody, className)} {...props}>
		{children}
	</div>
));

PopoverBody.displayName = "PopoverBody";
