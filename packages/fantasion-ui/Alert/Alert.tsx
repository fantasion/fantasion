import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Alert.module.scss";

export type AlertVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	/** Alert visual variant */
	variant?: AlertVariant;
	/** Show close button */
	dismissible?: boolean;
	/** Callback when close button is clicked */
	onClose?: () => void;
	/** Alert content */
	children: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ variant = "primary", dismissible, onClose, className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={clsx(styles.alert, styles[variant], dismissible && styles.dismissible, className)}
			role="alert"
			{...props}
		>
			{children}
			{dismissible && (
				<button type="button" className={styles.close} onClick={onClose} aria-label="Close">
					&times;
				</button>
			)}
		</div>
	),
);

Alert.displayName = "Alert";

// Sub-components
export interface AlertHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const AlertHeading = forwardRef<HTMLHeadingElement, AlertHeadingProps>(
	({ as: Component = "h4", className, children, ...props }, ref) => (
		<Component ref={ref} className={clsx(styles.heading, className)} {...props}>
			{children}
		</Component>
	),
);

AlertHeading.displayName = "AlertHeading";

export interface AlertLinkProps extends HTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
	href?: string;
}

export const AlertLink = forwardRef<HTMLAnchorElement, AlertLinkProps>(({ className, children, ...props }, ref) => (
	<a ref={ref} className={clsx(styles.link, className)} {...props}>
		{children}
	</a>
));

AlertLink.displayName = "AlertLink";
