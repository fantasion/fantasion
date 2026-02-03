import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Offcanvas.module.scss";

// ============================================
// OFFCANVAS
// ============================================

export type OffcanvasPlacement = "start" | "end" | "top" | "bottom";

const placementStyleMap: Record<OffcanvasPlacement, string> = {
	start: "start",
	end: "end",
	top: "top",
	bottom: "bottom",
};

export interface OffcanvasProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	/** Whether the offcanvas is shown */
	show: boolean;
	/** Callback when offcanvas should close */
	onHide?: () => void;
	/** Placement of the offcanvas */
	placement?: OffcanvasPlacement;
	/** Enable backdrop */
	backdrop?: boolean | "static";
	/** Enable keyboard (Escape key) */
	keyboard?: boolean;
	/** Enable scrolling the body while offcanvas is open */
	scroll?: boolean;
	children: ReactNode;
}

export const Offcanvas = forwardRef<HTMLDivElement, OffcanvasProps>(
	(
		{
			show,
			onHide,
			placement = "start",
			backdrop = true,
			keyboard = true,
			scroll = false,
			className,
			children,
			...props
		},
		ref,
	) => {
		// SSR safety: track if we're mounted on the client
		const [mounted, setMounted] = useState(false);
		// Track visibility for CSS transitions
		const [visible, setVisible] = useState(false);

		useEffect(() => {
			setMounted(true);
		}, []);

		// Handle visibility with transition delay
		useEffect(() => {
			if (show) {
				const timer = requestAnimationFrame(() => setVisible(true));
				return () => cancelAnimationFrame(timer);
			}
			setVisible(false);
		}, [show]);

		useEffect(() => {
			if (!mounted) return;
			if (show && !scroll) {
				document.body.style.overflow = "hidden";
				return () => {
					document.body.style.overflow = "";
				};
			}
		}, [show, scroll, mounted]);

		useEffect(() => {
			if (!(mounted && show && keyboard && onHide)) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					onHide();
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [show, keyboard, onHide, mounted]);

		// Don't render during SSR or when closed
		if (!(mounted && show)) return null;

		const handleBackdropClick = () => {
			if (backdrop !== "static" && onHide) {
				onHide();
			}
		};

		return createPortal(
			<>
				{backdrop && (
					<div className={clsx(styles.backdrop, visible && styles.backdropVisible)} onClick={handleBackdropClick} />
				)}
				<div
					ref={ref}
					className={clsx(styles.offcanvas, styles[placementStyleMap[placement]], visible && styles.show, className)}
					tabIndex={-1}
					{...props}
				>
					{children}
				</div>
			</>,
			document.body,
		);
	},
);

Offcanvas.displayName = "Offcanvas";

// ============================================
// OFFCANVAS HEADER
// ============================================

export interface OffcanvasHeaderProps extends HTMLAttributes<HTMLDivElement> {
	/** Close button click handler */
	closeButton?: boolean;
	/** Close button callback (if different from parent onHide) */
	onHide?: () => void;
	children: ReactNode;
}

export const OffcanvasHeader = forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
	({ closeButton, onHide, className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.header, className)} {...props}>
			{children}
			{closeButton && (
				<button type="button" className={styles.close} aria-label="Close" onClick={onHide}>
					&times;
				</button>
			)}
		</div>
	),
);

OffcanvasHeader.displayName = "OffcanvasHeader";

// ============================================
// OFFCANVAS TITLE
// ============================================

export interface OffcanvasTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: ReactNode;
}

export const OffcanvasTitle = forwardRef<HTMLHeadingElement, OffcanvasTitleProps>(
	({ as: Component = "h5", className, children, ...props }, ref) => (
		<Component ref={ref} className={clsx(styles.title, className)} {...props}>
			{children}
		</Component>
	),
);

OffcanvasTitle.displayName = "OffcanvasTitle";

// ============================================
// OFFCANVAS BODY
// ============================================

export interface OffcanvasBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const OffcanvasBody = forwardRef<HTMLDivElement, OffcanvasBodyProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.body, className)} {...props}>
			{children}
		</div>
	),
);

OffcanvasBody.displayName = "OffcanvasBody";
