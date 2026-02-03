"use client";

import { NavbarNavLink as NavLinkComponent } from "@fantasion/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { qsm } from "query-string-manipulator";
import { type ComponentType, type ElementType, forwardRef, type ReactNode } from "react";
import { useTranslation } from "../lib/i18n-context";
import { reverse } from "../routeMap";

type LinkProps = {
	activeProp?: string;
	as?: ElementType | ComponentType<Record<string, unknown>>;
	children: ReactNode;
	external?: boolean;
	href?: string;
	params?: Record<string, string>;
	query?: Record<string, string | number | boolean | undefined>;
	route?: string;
	disabled?: boolean;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
	title?: string;
} & Record<string, unknown>;

type NavLinkProps = {
	children: ReactNode;
	route?: string;
	params?: Record<string, string>;
	query?: Record<string, string | number | boolean | undefined>;
	className?: string;
};

const useResolvedHref = (
	route?: string,
	params?: Record<string, string>,
	query?: Record<string, string | number | boolean | undefined>,
	href?: string,
): string => {
	const { i18n } = useTranslation();
	const lang = i18n.language || "cs";
	if (route) {
		return qsm(reverse(lang, route, params || {}), { set: query });
	}
	return href || "/";
};

const useIsActive = (targetPath?: string) => {
	const pathname = usePathname();
	if (!targetPath) {
		return false;
	}
	return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
};

const handleExternalClick = (e: React.MouseEvent<HTMLElement>) => {
	e.preventDefault();
	const target = e.currentTarget as HTMLAnchorElement;
	const href = target.href || target.getAttribute("href");
	if (href) {
		window.open(href);
	}
};

/**
 * Modern Link component for Next.js 16+ with React Bootstrap support
 *
 * For Bootstrap components, we pass NextLink via the `as` prop so the component
 * renders using Next.js client-side routing.
 * For plain links, we use NextLink which renders an <a> directly.
 *
 * Usage:
 * - Plain link: <Link route="home">Home</Link>
 * - With Bootstrap component: <Link as={Button} route="home" variant="primary">Home</Link>
 * - External link: <Link href="https://example.com" external>External</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
	// Cast properties from the intersection type to their expected types
	const {
		activeProp,
		as: AsComponent,
		children,
		className,
		disabled,
		external,
		href,
		onClick,
		params,
		query,
		route,
		title,
		...rest
	} = props as {
		activeProp?: string;
		as?: ElementType;
		children: ReactNode;
		className?: string;
		disabled?: boolean;
		external?: boolean;
		href?: string;
		onClick?: React.MouseEventHandler<HTMLElement>;
		params?: Record<string, string>;
		query?: Record<string, string | number | boolean | undefined>;
		route?: string;
		title?: string;
	} & Record<string, unknown>;

	const target = useResolvedHref(route, params, query, href);
	const isActive = useIsActive(target);

	// Build props for active state
	const activeProps: Record<string, boolean> = {};
	if (activeProp && isActive) {
		activeProps[activeProp] = true;
	}

	// Handle disabled state - render without link functionality
	if (disabled) {
		if (AsComponent) {
			return (
				<AsComponent className={className} title={title} {...activeProps} {...rest}>
					{children}
				</AsComponent>
			);
		}
		return (
			<span className={className} title={title}>
				{children}
			</span>
		);
	}

	// Handle external links
	if (external) {
		if (AsComponent) {
			return (
				<AsComponent
					href={target}
					className={className}
					title={title}
					onClick={handleExternalClick}
					{...activeProps}
					{...rest}
				>
					{children}
				</AsComponent>
			);
		}
		return (
			<a href={target} className={className} title={title} onClick={handleExternalClick} ref={ref}>
				{children}
			</a>
		);
	}

	// For Bootstrap components (Button, Nav.Link, Card, etc.), pass NextLink
	// via the `as` prop so the component renders using Next.js routing
	if (AsComponent) {
		return (
			<AsComponent
				as={NextLink}
				href={target}
				className={className}
				title={title}
				onClick={onClick}
				{...activeProps}
				{...rest}
			>
				{children}
			</AsComponent>
		);
	}

	// Default: render NextLink directly (renders as <a> in Next.js 13+)
	return (
		<NextLink href={target} className={className} title={title} onClick={onClick} ref={ref}>
			{children}
		</NextLink>
	);
});

Link.displayName = "Link";

/**
 * Navigation link with automatic active state for Nav.Link
 */
export const NavLink = ({ children, route, params, query, className }: NavLinkProps) => (
	<Link activeProp="active" as={NavLinkComponent} route={route} params={params} query={query} className={className}>
		{children}
	</Link>
);
