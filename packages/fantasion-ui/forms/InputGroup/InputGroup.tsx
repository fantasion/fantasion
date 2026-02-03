import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./InputGroup.module.scss";

// ============================================
// INPUT GROUP
// ============================================

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
	/** Input group size */
	size?: "sm" | "md" | "lg";
	children: ReactNode;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
	({ size = "md", className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.inputGroup, size !== "md" && styles[size], className)} {...props}>
			{children}
		</div>
	),
);

InputGroup.displayName = "InputGroup";

// ============================================
// INPUT GROUP TEXT
// ============================================

export interface InputGroupTextProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

export const InputGroupText = forwardRef<HTMLSpanElement, InputGroupTextProps>(
	({ className, children, ...props }, ref) => (
		<span ref={ref} className={clsx(styles.text, className)} {...props}>
			{children}
		</span>
	),
);

InputGroupText.displayName = "InputGroupText";
