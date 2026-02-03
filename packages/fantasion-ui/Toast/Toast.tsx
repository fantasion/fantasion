import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Toast.module.scss";

export type ToastVariant = "default" | "primary" | "success" | "danger" | "warning" | "info";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
	variant?: ToastVariant;
	hiding?: boolean;
	onClose?: () => void;
	children: ReactNode;
}

const variantStyleMap: Record<string, string> = {
	primary: "primary",
	success: "success",
	danger: "danger",
	warning: "warning",
	info: "info",
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
	({ variant = "default", hiding, className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={clsx(
				styles.toast,
				variant !== "default" && styles[variantStyleMap[variant]],
				hiding && styles.hiding,
				className,
			)}
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
			{...props}
		>
			{children}
		</div>
	),
);
Toast.displayName = "Toast";

export interface ToastHeaderProps extends HTMLAttributes<HTMLDivElement> {
	onClose?: () => void;
	closeButton?: boolean;
	hideCloseButton?: boolean;
	children: ReactNode;
}

export const ToastHeader = forwardRef<HTMLDivElement, ToastHeaderProps>(
	({ onClose, closeButton, hideCloseButton, className, children, ...props }, ref) => {
		const showCloseButton = closeButton === true || (!hideCloseButton && onClose);
		return (
			<div ref={ref} className={clsx(styles.header, className)} {...props}>
				<div className={styles.title}>{children}</div>
				{showCloseButton && onClose && (
					<button type="button" className={styles.close} onClick={onClose} aria-label="Close">
						&times;
					</button>
				)}
			</div>
		);
	},
);
ToastHeader.displayName = "ToastHeader";

export interface ToastBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const ToastBody = forwardRef<HTMLDivElement, ToastBodyProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.body, className)} {...props}>
		{children}
	</div>
));
ToastBody.displayName = "ToastBody";

export type ToastPosition =
	| "top-start"
	| "top-center"
	| "top-end"
	| "middle-start"
	| "middle-center"
	| "middle-end"
	| "bottom-start"
	| "bottom-center"
	| "bottom-end";

export interface ToastContainerProps extends HTMLAttributes<HTMLDivElement> {
	position?: ToastPosition;
	children: ReactNode;
}

const positionStyleMap: Record<ToastPosition, string> = {
	"top-start": "topStart",
	"top-center": "topCenter",
	"top-end": "topEnd",
	"middle-start": "middleStart",
	"middle-center": "middleCenter",
	"middle-end": "middleEnd",
	"bottom-start": "bottomStart",
	"bottom-center": "bottomCenter",
	"bottom-end": "bottomEnd",
};

export const ToastContainer = forwardRef<HTMLDivElement, ToastContainerProps>(
	({ position = "top-end", className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.container, styles[positionStyleMap[position]], className)} {...props}>
			{children}
		</div>
	),
);
ToastContainer.displayName = "ToastContainer";
