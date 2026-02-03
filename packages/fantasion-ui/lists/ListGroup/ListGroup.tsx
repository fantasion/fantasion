import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from "react";
import styles from "./ListGroup.module.scss";

// ============================================
// LIST GROUP
// ============================================

export type ListGroupVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export interface ListGroupProps extends HTMLAttributes<HTMLUListElement> {
	/** Render as ordered list */
	as?: "ul" | "ol" | "div";
	/** Remove borders and rounded corners */
	flush?: boolean;
	/** Horizontal layout */
	horizontal?: boolean | "sm" | "md" | "lg" | "xl" | "xxl";
	/** Numbered list */
	numbered?: boolean;
	/** Color variant */
	variant?: ListGroupVariant;
	children: ReactNode;
}

const horizontalStyleMap: Record<string, string> = {
	sm: "horizontalSm",
	md: "horizontalMd",
	lg: "horizontalLg",
	xl: "horizontalXl",
	xxl: "horizontalXxl",
};

export const ListGroup = forwardRef<HTMLElement, ListGroupProps>(
	({ as = "ul", flush, horizontal, numbered, variant, className, children, ...props }, ref) => {
		const horizontalClass =
			horizontal === true ? styles.horizontal : horizontal ? styles[horizontalStyleMap[horizontal]] : undefined;

		const classes = clsx(
			styles.listGroup,
			flush && styles.flush,
			horizontalClass,
			numbered && styles.numbered,
			className,
		);

		if (as === "ol") {
			return (
				<ol
					ref={ref as React.Ref<HTMLOListElement>}
					className={classes}
					{...(props as HTMLAttributes<HTMLOListElement>)}
				>
					{children}
				</ol>
			);
		}

		if (as === "div") {
			return (
				<div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...(props as HTMLAttributes<HTMLDivElement>)}>
					{children}
				</div>
			);
		}

		return (
			<ul ref={ref as React.Ref<HTMLUListElement>} className={classes} {...(props as HTMLAttributes<HTMLUListElement>)}>
				{children}
			</ul>
		);
	},
);

ListGroup.displayName = "ListGroup";

// ============================================
// LIST GROUP ITEM
// ============================================

export interface ListGroupItemProps extends LiHTMLAttributes<HTMLLIElement> {
	/** Action item styling (hover effects) */
	action?: boolean;
	/** Active state */
	active?: boolean;
	/** Disabled state */
	disabled?: boolean;
	/** Color variant */
	variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
	/** Render as different element */
	as?: "li" | "a" | "button" | "div";
	/** Href for anchor items */
	href?: string;
	children: ReactNode;
}

const variantStyleMap: Record<string, string> = {
	primary: "itemPrimary",
	secondary: "itemSecondary",
	success: "itemSuccess",
	danger: "itemDanger",
	warning: "itemWarning",
	info: "itemInfo",
	light: "itemLight",
	dark: "itemDark",
};

export const ListGroupItem = forwardRef<HTMLLIElement, ListGroupItemProps>(
	({ as: Component = "li", action, active, disabled, variant, href, className, children, ...props }, ref) => {
		const classes = clsx(
			styles.item,
			action && styles.itemAction,
			active && styles.itemActive,
			disabled && styles.itemDisabled,
			variant && styles[variantStyleMap[variant]],
			className,
		);

		if (Component === "a") {
			return (
				<a
					ref={ref as React.Ref<HTMLAnchorElement>}
					href={href}
					className={classes}
					aria-disabled={disabled ? "true" : undefined}
					{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{children}
				</a>
			);
		}

		if (Component === "button") {
			return (
				<button
					ref={ref as React.Ref<HTMLButtonElement>}
					type="button"
					className={classes}
					disabled={disabled}
					{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
				>
					{children}
				</button>
			);
		}

		if (Component === "div") {
			return (
				<div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...(props as HTMLAttributes<HTMLDivElement>)}>
					{children}
				</div>
			);
		}

		return (
			<li ref={ref} className={classes} aria-disabled={disabled ? "true" : undefined} {...props}>
				{children}
			</li>
		);
	},
);

ListGroupItem.displayName = "ListGroupItem";
