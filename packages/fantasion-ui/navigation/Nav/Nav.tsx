import clsx from "clsx";
import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	forwardRef,
	type HTMLAttributes,
	type LiHTMLAttributes,
	type ReactNode,
} from "react";
import styles from "./Nav.module.scss";

// ============================================
// NAV
// ============================================

export type NavVariant = "tabs" | "pills" | "underline";

const variantStyleMap: Record<NavVariant, string> = {
	tabs: "tabs",
	pills: "pills",
	underline: "underline",
};

export interface NavProps extends HTMLAttributes<HTMLElement> {
	/** Navigation visual variant */
	variant?: NavVariant;
	/** Vertical orientation */
	vertical?: boolean;
	/** Fill available space */
	fill?: boolean;
	/** Justify items to fill space equally */
	justified?: boolean;
	children: ReactNode;
}

export const Nav = forwardRef<HTMLElement, NavProps>(
	({ variant, vertical, fill, justified, className, children, ...props }, ref) => (
		<nav
			ref={ref}
			className={clsx(
				styles.nav,
				variant && styles[variantStyleMap[variant]],
				vertical && styles.vertical,
				fill && styles.fill,
				justified && styles.justified,
				className,
			)}
			{...props}
		>
			<ul className={styles.nav}>{children}</ul>
		</nav>
	),
);

Nav.displayName = "Nav";

// ============================================
// NAV ITEM
// ============================================

export interface NavItemProps extends LiHTMLAttributes<HTMLLIElement> {
	children: ReactNode;
}

export const NavItem = forwardRef<HTMLLIElement, NavItemProps>(({ className, children, ...props }, ref) => (
	<li ref={ref} className={clsx(styles.item, className)} {...props}>
		{children}
	</li>
));

NavItem.displayName = "NavItem";

// ============================================
// NAV LINK
// ============================================

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Mark as active */
	active?: boolean;
	/** Mark as disabled */
	disabled?: boolean;
	children: ReactNode;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
	({ active, disabled, className, children, ...props }, ref) => (
		<a
			ref={ref}
			className={clsx(styles.link, active && styles.linkActive, disabled && styles.linkDisabled, className)}
			aria-current={active ? "page" : undefined}
			aria-disabled={disabled ? "true" : undefined}
			{...props}
		>
			{children}
		</a>
	),
);

NavLink.displayName = "NavLink";

// ============================================
// NAV BUTTON (for non-link navigation)
// ============================================

export interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Mark as active */
	active?: boolean;
	children: ReactNode;
}

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
	({ active, className, children, disabled, ...props }, ref) => (
		<button
			ref={ref}
			type="button"
			className={clsx(styles.link, active && styles.linkActive, disabled && styles.linkDisabled, className)}
			disabled={disabled}
			aria-current={active ? "page" : undefined}
			{...props}
		>
			{children}
		</button>
	),
);

NavButton.displayName = "NavButton";
