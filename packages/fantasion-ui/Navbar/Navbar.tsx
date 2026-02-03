"use client";

import clsx from "clsx";
import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	createContext,
	forwardRef,
	type HTMLAttributes,
	type LiHTMLAttributes,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Container } from "../grid/Container/Container";
import styles from "./Navbar.module.scss";

// ============================================
// NAVBAR CONTEXT
// ============================================

interface NavbarContextValue {
	expanded: boolean;
	onToggle: (expanded: boolean) => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

function useNavbarContext() {
	return useContext(NavbarContext);
}

// ============================================
// NAVBAR
// ============================================

export type NavbarExpand = "sm" | "md" | "lg" | "xl" | "xxl" | true;
export type NavbarColorScheme = "light" | "dark" | "primary";
export type NavbarPosition = "fixed-top" | "fixed-bottom" | "sticky-top" | "sticky-bottom";

const expandStyleMap: Record<string, string> = {
	sm: "expandSm",
	md: "expandMd",
	lg: "expandLg",
	xl: "expandXl",
	xxl: "expandXxl",
};

const colorSchemeStyleMap: Record<NavbarColorScheme, string> = {
	light: "light",
	dark: "dark",
	primary: "primary",
};

const positionStyleMap: Record<NavbarPosition, string> = {
	"fixed-top": "fixedTop",
	"fixed-bottom": "fixedBottom",
	"sticky-top": "stickyTop",
	"sticky-bottom": "stickyBottom",
};

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, "onToggle"> {
	/** Breakpoint at which navbar expands */
	expand?: NavbarExpand;
	/** Color scheme */
	colorScheme?: NavbarColorScheme;
	/** Fixed/sticky positioning */
	position?: NavbarPosition;
	/** Whether navbar is expanded (controlled) */
	expanded?: boolean;
	/** Callback when navbar toggle state changes */
	onToggle?: (expanded: boolean) => void;
	/** Fixed positioning (shorthand) */
	fixed?: "top" | "bottom";
	/** Sticky positioning (shorthand) */
	sticky?: "top" | "bottom";
	/** Scroll distance (px) after which scrolledClassName is applied */
	scrollThreshold?: number;
	/** CSS class to apply when scrolled past threshold */
	scrolledClassName?: string;
	/** Close expanded menu when clicking outside the navbar (requires controlled mode) */
	autoClose?: boolean;
	/** Close expanded menu when user scrolls (requires controlled mode) */
	scrollClose?: boolean;
	children: ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
	(
		{
			expand,
			colorScheme = "light",
			position,
			expanded,
			onToggle,
			fixed,
			sticky,
			scrollThreshold,
			scrolledClassName,
			autoClose,
			scrollClose,
			className,
			children,
			...props
		},
		ref,
	) => {
		const internalRef = useRef<HTMLElement | null>(null);
		const [scrolled, setScrolled] = useState(false);

		const mergedRef = useCallback(
			(node: HTMLElement | null) => {
				internalRef.current = node;
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLElement | null>).current = node;
				}
			},
			[ref],
		);

		// Scroll threshold: toggle scrolled state when scroll position crosses the threshold
		useEffect(() => {
			if (scrollThreshold == null) return;
			const handleScroll = () => {
				const scrollTop = document.documentElement?.scrollTop || document.body?.scrollTop || 0;
				setScrolled(scrollTop > scrollThreshold);
			};
			handleScroll();
			window.addEventListener("scroll", handleScroll, { passive: true });
			return () => window.removeEventListener("scroll", handleScroll);
		}, [scrollThreshold]);

		// Auto-close: collapse when clicking outside the navbar
		useEffect(() => {
			if (!(autoClose && expanded && onToggle)) return;
			const handleMouseDown = (event: MouseEvent) => {
				if (internalRef.current && event.target instanceof Node && !internalRef.current.contains(event.target)) {
					onToggle(false);
				}
			};
			document.addEventListener("mousedown", handleMouseDown);
			return () => document.removeEventListener("mousedown", handleMouseDown);
		}, [autoClose, expanded, onToggle]);

		// Scroll close: collapse when user scrolls while menu is open
		useEffect(() => {
			if (!(scrollClose && expanded && onToggle)) return;
			const handleScroll = () => onToggle(false);
			window.addEventListener("scroll", handleScroll, { passive: true });
			return () => window.removeEventListener("scroll", handleScroll);
		}, [scrollClose, expanded, onToggle]);

		const expandClass = expand === true ? styles.expand : expand ? styles[expandStyleMap[expand]] : "";

		// Handle position shortcuts
		let resolvedPosition = position;
		if (fixed) resolvedPosition = fixed === "top" ? "fixed-top" : "fixed-bottom";
		if (sticky) resolvedPosition = sticky === "top" ? "sticky-top" : "sticky-bottom";

		const contextValue = expanded !== undefined && onToggle ? { expanded, onToggle } : null;

		const nav = (
			<nav
				ref={mergedRef}
				className={clsx(
					styles.navbar,
					expandClass,
					styles[colorSchemeStyleMap[colorScheme]],
					resolvedPosition && styles[positionStyleMap[resolvedPosition]],
					scrolled && scrolledClassName,
					className,
				)}
				{...props}
			>
				{children}
			</nav>
		);

		if (contextValue) {
			return <NavbarContext.Provider value={contextValue}>{nav}</NavbarContext.Provider>;
		}

		return nav;
	},
);

Navbar.displayName = "Navbar";

// ============================================
// NAVBAR BRAND
// ============================================

export interface NavbarBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Render as a span instead of anchor */
	as?: "a" | "span";
	children: ReactNode;
}

export const NavbarBrand = forwardRef<HTMLAnchorElement | HTMLSpanElement, NavbarBrandProps>(
	({ as: Component = "a", className, children, ...props }, ref) => {
		const classes = clsx(styles.brand, className);

		if (Component === "span") {
			return (
				<span
					ref={ref as React.Ref<HTMLSpanElement>}
					className={classes}
					{...(props as HTMLAttributes<HTMLSpanElement>)}
				>
					{children}
				</span>
			);
		}

		return (
			<a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...props}>
				{children}
			</a>
		);
	},
);

NavbarBrand.displayName = "NavbarBrand";

// ============================================
// NAVBAR TOGGLER
// ============================================

export interface NavbarTogglerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Label for accessibility */
	label?: string;
}

export const NavbarToggler = forwardRef<HTMLButtonElement, NavbarTogglerProps>(
	({ label = "Toggle navigation", className, onClick, ...props }, ref) => {
		const context = useNavbarContext();

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(e);
			if (context) {
				context.onToggle(!context.expanded);
			}
		};

		return (
			<button
				ref={ref}
				type="button"
				className={clsx(styles.toggler, className)}
				aria-label={label}
				aria-expanded={context?.expanded}
				onClick={handleClick}
				{...props}
			>
				{props.children ?? <span className={styles.togglerIcon} />}
			</button>
		);
	},
);

NavbarToggler.displayName = "NavbarToggler";

// ============================================
// NAVBAR COLLAPSE
// ============================================

export interface NavbarCollapseProps extends HTMLAttributes<HTMLDivElement> {
	/** Whether the collapse is expanded */
	show?: boolean;
	children: ReactNode;
}

export const NavbarCollapse = forwardRef<HTMLDivElement, NavbarCollapseProps>(
	({ show, className, children, ...props }, ref) => {
		const context = useNavbarContext();
		const isShown = show ?? context?.expanded ?? false;

		return (
			<div ref={ref} className={clsx(styles.collapse, isShown && styles.collapseShow, className)} {...props}>
				{children}
			</div>
		);
	},
);

NavbarCollapse.displayName = "NavbarCollapse";

// ============================================
// NAVBAR NAV
// ============================================

export interface NavbarNavProps extends HTMLAttributes<HTMLUListElement> {
	children: ReactNode;
}

export const NavbarNav = forwardRef<HTMLUListElement, NavbarNavProps>(({ className, children, ...props }, ref) => (
	<ul ref={ref} className={clsx(styles.nav, className)} {...props}>
		{children}
	</ul>
));

NavbarNav.displayName = "NavbarNav";

// ============================================
// NAVBAR NAV ITEM
// ============================================

export interface NavbarNavItemProps extends LiHTMLAttributes<HTMLLIElement> {
	children: ReactNode;
}

export const NavbarNavItem = forwardRef<HTMLLIElement, NavbarNavItemProps>(({ className, children, ...props }, ref) => (
	<li ref={ref} className={className} {...props}>
		{children}
	</li>
));

NavbarNavItem.displayName = "NavbarNavItem";

// ============================================
// NAVBAR NAV LINK
// ============================================

export interface NavbarNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Mark as active */
	active?: boolean;
	/** Mark as disabled */
	disabled?: boolean;
	children: ReactNode;
}

export const NavbarNavLink = forwardRef<HTMLAnchorElement, NavbarNavLinkProps>(
	({ active, disabled, className, children, ...props }, ref) => (
		<a
			ref={ref}
			className={clsx(styles.navLink, active && styles.navLinkActive, disabled && styles.navLinkDisabled, className)}
			aria-current={active ? "page" : undefined}
			aria-disabled={disabled ? "true" : undefined}
			{...props}
		>
			{children}
		</a>
	),
);

NavbarNavLink.displayName = "NavbarNavLink";

// ============================================
// NAVBAR TEXT
// ============================================

export interface NavbarTextProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

export const NavbarText = forwardRef<HTMLSpanElement, NavbarTextProps>(({ className, children, ...props }, ref) => (
	<span ref={ref} className={clsx(styles.text, className)} {...props}>
		{children}
	</span>
));

NavbarText.displayName = "NavbarText";

export function NavbarContainer({ children, className }: { children: ReactNode; className?: string }) {
	return <Container className={clsx(styles.container, className)}>{children}</Container>;
}
