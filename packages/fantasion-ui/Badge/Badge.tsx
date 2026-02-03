import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	/** Badge visual variant */
	variant?: BadgeVariant;
	/** Badge background color (react-bootstrap compatible alias for variant) */
	bg?: BadgeVariant;
	/** Render as pill shape */
	pill?: boolean;
	/** Larger badge size */
	lg?: boolean;
	/** Position badge on parent element corner */
	positioned?: boolean;
	/** Badge content */
	children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ variant, bg, pill, lg, positioned, className, children, ...props }, ref) => {
		// Support both variant and bg props (bg is react-bootstrap compatible)
		const resolvedVariant = variant ?? bg ?? "primary";

		return (
			<span
				ref={ref}
				className={clsx(
					styles.badge,
					styles[resolvedVariant],
					pill && styles.pill,
					lg && styles.lg,
					positioned && styles.positioned,
					className,
				)}
				{...props}
			>
				{children}
			</span>
		);
	},
);

Badge.displayName = "Badge";
