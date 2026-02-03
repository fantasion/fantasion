import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./ButtonGroup.module.scss";

// ============================================
// BUTTON GROUP
// ============================================

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
	/** Size of buttons in the group */
	size?: "sm" | "lg";
	/** Vertical button group */
	vertical?: boolean;
	/** ARIA label for the group */
	"aria-label"?: string;
	children: ReactNode;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ size, vertical, className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={clsx(vertical ? styles.vertical : styles.btnGroup, size && styles[size], className)}
			role="group"
			{...props}
		>
			{children}
		</div>
	),
);

ButtonGroup.displayName = "ButtonGroup";

// ============================================
// BUTTON TOOLBAR
// ============================================

export interface ButtonToolbarProps extends HTMLAttributes<HTMLDivElement> {
	/** ARIA label for the toolbar */
	"aria-label"?: string;
	children: ReactNode;
}

export const ButtonToolbar = forwardRef<HTMLDivElement, ButtonToolbarProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.toolbar, className)} role="toolbar" {...props}>
			{children}
		</div>
	),
);

ButtonToolbar.displayName = "ButtonToolbar";
