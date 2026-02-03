import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import styles from "./Button.module.scss";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "inline"
	| "link"
	| "outline-primary"
	| "outline-secondary"
	| "outline-light";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Button visual variant */
	variant?: ButtonVariant;
	/** Button size */
	size?: ButtonSize;
	/** Make button full-width */
	block?: boolean;
	/** Icon-only button (square aspect ratio) */
	icon?: boolean;
	/** Show loading spinner */
	loading?: boolean;
	/** Render as anchor when href is provided */
	href?: string;
	/** Button content */
	children: ReactNode;
}

// Map variant names to style keys
const variantStyleMap: Record<ButtonVariant, string> = {
	primary: "primary",
	secondary: "secondary",
	inline: "inline",
	link: "link",
	"outline-primary": "outlinePrimary",
	"outline-secondary": "outlineSecondary",
	"outline-light": "outlineLight",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
	({ variant = "primary", size = "md", block, icon, loading, className, children, disabled, href, ...props }, ref) => {
		const variantKey = variantStyleMap[variant];
		const classes = clsx(
			styles.btn,
			styles[variantKey],
			size !== "md" && styles[size],
			block && styles.block,
			icon && styles.icon,
			loading && styles.loading,
			className,
		);

		if (href != null) {
			return (
				<a ref={ref as React.Ref<HTMLAnchorElement>} href={href} data-fui-btn="" className={classes}>
					{children}
				</a>
			);
		}

		return (
			<button
				ref={ref as React.Ref<HTMLButtonElement>}
				data-fui-btn=""
				className={classes}
				disabled={disabled || loading}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
