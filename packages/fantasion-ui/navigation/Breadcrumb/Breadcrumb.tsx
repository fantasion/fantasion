import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Breadcrumb.module.scss";

// ============================================
// BREADCRUMB
// ============================================

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ className, children, ...props }, ref) => (
	<nav ref={ref} aria-label="breadcrumb" {...props}>
		<ol className={clsx(styles.breadcrumb, className)}>{children}</ol>
	</nav>
));

Breadcrumb.displayName = "Breadcrumb";

// ============================================
// BREADCRUMB ITEM
// ============================================

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
	/** Mark as the current/active page */
	active?: boolean;
	/** Link href (if not active) */
	href?: string;
	children: ReactNode;
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
	({ active, href, className, children, ...props }, ref) => (
		<li
			ref={ref}
			className={clsx(styles.item, active && styles.active, className)}
			aria-current={active ? "page" : undefined}
			{...props}
		>
			{active ? (
				children
			) : href ? (
				<a href={href} className={styles.link}>
					{children}
				</a>
			) : (
				children
			)}
		</li>
	),
);

BreadcrumbItem.displayName = "BreadcrumbItem";
