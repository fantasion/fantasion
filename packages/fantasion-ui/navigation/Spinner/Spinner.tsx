import clsx from "clsx";
import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import styles from "./Spinner.module.scss";

export type SpinnerAnimation = "border" | "grow";
export type SpinnerVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
export type SpinnerSize = "sm";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	/** Render as different HTML element */
	as?: ElementType;
	/** Animation style */
	animation?: SpinnerAnimation;
	/** Color variant */
	variant?: SpinnerVariant;
	/** Small size */
	size?: SpinnerSize;
	/** Accessible label */
	label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
	({ as: Component = "div", animation = "border", variant, size, label = "Loading...", className, ...props }, ref) => (
		<Component
			ref={ref}
			className={clsx(styles.spinner, styles[animation], variant && styles[variant], size && styles[size], className)}
			role="status"
			{...props}
		>
			<span className={styles.visuallyHidden}>{label}</span>
		</Component>
	),
);

Spinner.displayName = "Spinner";
