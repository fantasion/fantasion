import clsx from "clsx";
import { type ElementType, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Container.module.scss";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	/** Content to render inside the container */
	children: ReactNode;
	/** Make the container fluid (full-width) */
	fluid?: boolean | "sm" | "md" | "lg" | "xl" | "xxl";
	/** Render as different HTML element */
	as?: ElementType;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ as: Component = "div", fluid, className, children, ...props }, ref) => {
		const getFluidClass = () => {
			if (fluid === true) return styles.fluid;
			if (typeof fluid === "string") return styles[fluid];
			return null;
		};

		return (
			<Component ref={ref} className={clsx(styles.container, getFluidClass(), className)} {...props}>
				{children}
			</Component>
		);
	},
);

Container.displayName = "Container";
