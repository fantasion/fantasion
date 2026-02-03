import clsx from "clsx";
import { type ElementType, forwardRef, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import styles from "./Card.module.scss";

const borderStyleMap: Record<string, string> = {
	primary: "borderPrimary",
	secondary: "borderSecondary",
	success: "borderSuccess",
	danger: "borderDanger",
	warning: "borderWarning",
	info: "borderInfo",
	light: "borderLight",
	dark: "borderDark",
};

const bgStyleMap: Record<string, string> = {
	primary: "bgPrimary",
	secondary: "bgSecondary",
	success: "bgSuccess",
	danger: "bgDanger",
	warning: "bgWarning",
	info: "bgInfo",
	light: "bgLight",
	dark: "bgDark",
};

const textStyleMap: Record<string, string> = {
	primary: "textPrimary",
	secondary: "textSecondary",
	success: "textSuccess",
	danger: "textDanger",
	warning: "textWarning",
	info: "textInfo",
	light: "textLight",
	dark: "textDark",
	muted: "textMuted",
	white: "textWhite",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	as?: ElementType;
	border?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
	bg?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
	text?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "muted" | "white";
	children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ as: Component = "div", border, bg, text, className, children, ...props }, ref) => (
		<Component
			ref={ref}
			className={clsx(
				styles.card,
				border && styles[borderStyleMap[border]],
				bg && styles[bgStyleMap[bg]],
				text && styles[textStyleMap[text]],
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	),
);
Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.header, className)} {...props}>
		{children}
	</div>
));
CardHeader.displayName = "CardHeader";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.body, className)} {...props}>
		{children}
	</div>
));
CardBody.displayName = "CardBody";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.footer, className)} {...props}>
		{children}
	</div>
));
CardFooter.displayName = "CardFooter";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: ReactNode;
}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ as: Component = "h5", className, children, ...props }, ref) => (
		<Component ref={ref} className={clsx(styles.title, className)} {...props}>
			{children}
		</Component>
	),
);
CardTitle.displayName = "CardTitle";

export interface CardSubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: ReactNode;
}
export const CardSubtitle = forwardRef<HTMLHeadingElement, CardSubtitleProps>(
	({ as: Component = "h6", className, children, ...props }, ref) => (
		<Component ref={ref} className={clsx(styles.subtitle, className)} {...props}>
			{children}
		</Component>
	),
);
CardSubtitle.displayName = "CardSubtitle";

export interface CardTextProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}
export const CardText = forwardRef<HTMLParagraphElement, CardTextProps>(({ className, children, ...props }, ref) => (
	<p ref={ref} className={clsx(styles.text, className)} {...props}>
		{children}
	</p>
));
CardText.displayName = "CardText";

const imgVariantStyleMap: Record<string, string> = {
	top: "imgTop",
	bottom: "imgBottom",
};

export interface CardImgProps extends ImgHTMLAttributes<HTMLImageElement> {
	variant?: "top" | "bottom";
}
export const CardImg = forwardRef<HTMLImageElement, CardImgProps>(({ variant, className, ...props }, ref) => (
	<img ref={ref} className={clsx(styles.img, variant && styles[imgVariantStyleMap[variant]], className)} {...props} />
));
CardImg.displayName = "CardImg";

export interface CardImgOverlayProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
export const CardImgOverlay = forwardRef<HTMLDivElement, CardImgOverlayProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.imgOverlay, className)} {...props}>
			{children}
		</div>
	),
);
CardImgOverlay.displayName = "CardImgOverlay";

export interface CardLinkProps extends HTMLAttributes<HTMLAnchorElement> {
	href?: string;
	children: ReactNode;
}
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(({ className, children, ...props }, ref) => (
	<a ref={ref} className={clsx(styles.link, className)} {...props}>
		{children}
	</a>
));
CardLink.displayName = "CardLink";
