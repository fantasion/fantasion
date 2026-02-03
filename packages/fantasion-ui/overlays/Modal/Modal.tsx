import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const sizeStyleMap: Record<string, string> = {
	sm: "sm",
	lg: "lg",
	xl: "xl",
};

const fullscreenStyleMap: Record<string, string> = {
	"sm-down": "fullscreenSmDown",
	"md-down": "fullscreenMdDown",
	"lg-down": "fullscreenLgDown",
	"xl-down": "fullscreenXlDown",
	"xxl-down": "fullscreenXxlDown",
};

export interface ModalProps {
	open?: boolean;
	show?: boolean;
	onClose?: () => void;
	onHide?: () => void;
	onExited?: () => void;
	onEntered?: () => void;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	size?: ModalSize;
	fullscreen?: boolean | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down";
	centered?: boolean;
	scrollable?: boolean;
	className?: string;
	children: ReactNode;
}

export function Modal({
	open,
	show,
	onClose,
	onHide,
	onExited,
	onEntered,
	onClick,
	size = "md",
	fullscreen,
	centered,
	scrollable,
	className,
	children,
}: ModalProps) {
	const isOpen = open ?? show ?? false;
	const handleClose = onClose ?? onHide;

	// SSR safety: track if we're mounted on the client
	const [mounted, setMounted] = useState(false);
	// Track visibility for CSS transitions
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Handle visibility with transition delay
	useEffect(() => {
		if (isOpen) {
			// Small delay to trigger CSS transition
			const timer = requestAnimationFrame(() => setVisible(true));
			return () => cancelAnimationFrame(timer);
		}
		setVisible(false);
	}, [isOpen]);

	useEffect(() => {
		if (!mounted) return;
		if (isOpen) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			onEntered?.();
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
		onExited?.();
	}, [isOpen, mounted]);

	useEffect(() => {
		if (!(mounted && isOpen)) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") handleClose?.();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, handleClose, mounted]);

	// Don't render during SSR or when closed
	if (!(mounted && isOpen)) return null;

	const fullscreenClass =
		fullscreen === true ? styles.fullscreen : fullscreen ? styles[fullscreenStyleMap[fullscreen]] : "";

	const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		onClick?.(e);
	};

	return createPortal(
		<div className={clsx(styles.backdrop, visible && styles.backdropVisible)} onClick={handleClose} role="presentation">
			<div
				className={clsx(
					styles.modal,
					visible && styles.modalVisible,
					size !== "md" && styles[sizeStyleMap[size]],
					fullscreenClass,
					centered && styles.centered,
					scrollable && styles.scrollable,
					className,
				)}
				onClick={handleModalClick}
				role="dialog"
				aria-modal="true"
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
Modal.displayName = "Modal";

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
	onClose?: () => void;
	onHide?: () => void;
	closeButton?: boolean;
	hideCloseButton?: boolean;
	children: ReactNode;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
	({ onClose, onHide, closeButton, hideCloseButton, className, children, ...props }, ref) => {
		const handleClose = onClose ?? onHide;
		const showCloseButton = closeButton === true || (!hideCloseButton && handleClose);
		return (
			<div ref={ref} className={clsx(styles.header, className)} {...props}>
				{children}
				{showCloseButton && handleClose && (
					<button type="button" className={styles.close} onClick={handleClose} aria-label="Close">
						&times;
					</button>
				)}
			</div>
		);
	},
);
ModalHeader.displayName = "ModalHeader";

export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
	children: ReactNode;
}

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
	({ as: Component = "h5", className, children, ...props }, ref) => (
		<Component ref={ref as React.Ref<HTMLHeadingElement>} className={clsx(styles.title, className)} {...props}>
			{children}
		</Component>
	),
);
ModalTitle.displayName = "ModalTitle";

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.body, className)} {...props}>
		{children}
	</div>
));
ModalBody.displayName = "ModalBody";

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.footer, className)} {...props}>
		{children}
	</div>
));
ModalFooter.displayName = "ModalFooter";
