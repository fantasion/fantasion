import clsx from "clsx";
import {
	cloneElement,
	forwardRef,
	type HTMLAttributes,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.scss";

// ============================================
// TOOLTIP
// ============================================

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "dark" | "light" | "primary";

interface TooltipTriggerProps {
	onMouseEnter?: React.MouseEventHandler;
	onMouseLeave?: React.MouseEventHandler;
	onFocus?: React.FocusEventHandler;
	onBlur?: React.FocusEventHandler;
	ref?: React.Ref<HTMLElement>;
}

export interface TooltipProps {
	/** Tooltip content */
	content: ReactNode;
	/** Placement relative to target */
	placement?: TooltipPlacement;
	/** Visual variant */
	variant?: TooltipVariant;
	/** Trigger element */
	children: ReactElement<TooltipTriggerProps>;
}

const placementStyleMap: Record<TooltipPlacement, string> = {
	top: "top",
	bottom: "bottom",
	left: "left",
	right: "right",
};

const variantStyleMap: Record<string, string> = {
	light: "light",
	primary: "primary",
};

export function Tooltip({ content, placement = "top", variant = "dark", children }: TooltipProps) {
	// SSR safety: track if we're mounted on the client
	const [mounted, setMounted] = useState(false);
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const showTooltip = () => setVisible(true);
	const hideTooltip = () => setVisible(false);

	useEffect(() => {
		if (!(visible && triggerRef.current && tooltipRef.current)) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const gap = 8;

		let top = 0;
		let left = 0;

		switch (placement) {
			case "top":
				top = triggerRect.top - tooltipRect.height - gap + window.scrollY;
				left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + window.scrollX;
				break;
			case "bottom":
				top = triggerRect.bottom + gap + window.scrollY;
				left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + window.scrollX;
				break;
			case "left":
				top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + window.scrollY;
				left = triggerRect.left - tooltipRect.width - gap + window.scrollX;
				break;
			case "right":
				top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + window.scrollY;
				left = triggerRect.right + gap + window.scrollX;
				break;
		}

		setPosition({ top: top, left: left });
	}, [visible, placement]);

	const tooltipClasses = clsx(
		styles.tooltip,
		styles[placementStyleMap[placement]],
		variant !== "dark" && styles[variantStyleMap[variant]],
	);

	if (!isValidElement(children)) {
		return children;
	}

	const childProps = children.props;

	const trigger = cloneElement(children, {
		ref: triggerRef,
		onMouseEnter: (e: React.MouseEvent) => {
			showTooltip();
			childProps.onMouseEnter?.(e);
		},
		onMouseLeave: (e: React.MouseEvent) => {
			hideTooltip();
			childProps.onMouseLeave?.(e);
		},
		onFocus: (e: React.FocusEvent) => {
			showTooltip();
			childProps.onFocus?.(e);
		},
		onBlur: (e: React.FocusEvent) => {
			hideTooltip();
			childProps.onBlur?.(e);
		},
	});

	return (
		<>
			{trigger}
			{mounted &&
				visible &&
				createPortal(
					<div
						ref={tooltipRef}
						className={tooltipClasses}
						style={{ top: position.top, left: position.left }}
						role="tooltip"
					>
						{content}
						<span className={styles.arrow} />
					</div>,
					document.body,
				)}
		</>
	);
}

Tooltip.displayName = "Tooltip";

// ============================================
// STANDALONE TOOLTIP (for controlled usage)
// ============================================

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
	/** Placement affects arrow direction */
	placement?: TooltipPlacement;
	/** Visual variant */
	variant?: TooltipVariant;
	children: ReactNode;
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
	({ placement = "top", variant = "dark", className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={clsx(
				styles.tooltip,
				styles[placementStyleMap[placement]],
				variant !== "dark" && styles[variantStyleMap[variant]],
				className,
			)}
			role="tooltip"
			{...props}
		>
			{children}
			<span className={styles.arrow} />
		</div>
	),
);

TooltipContent.displayName = "TooltipContent";

// ============================================
// OVERLAY (for controlled positioning)
// ============================================

export interface OverlayProps {
	/** Target element to position against */
	target: HTMLElement | null;
	/** Whether overlay is visible */
	show: boolean;
	/** Placement relative to target */
	placement?: TooltipPlacement;
	/** Overlay content */
	children: ReactNode;
}

export function Overlay({ target, show, placement = "top", children }: OverlayProps) {
	// SSR safety: track if we're mounted on the client
	const [mounted, setMounted] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!(show && target && overlayRef.current)) return;

		const updatePosition = () => {
			if (!(target && overlayRef.current)) return;

			const targetRect = target.getBoundingClientRect();
			const overlayRect = overlayRef.current.getBoundingClientRect();
			const gap = 8;

			let top = 0;
			let left = 0;

			switch (placement) {
				case "top":
					top = targetRect.top - overlayRect.height - gap + window.scrollY;
					left = targetRect.left + targetRect.width / 2 - overlayRect.width / 2 + window.scrollX;
					break;
				case "bottom":
					top = targetRect.bottom + gap + window.scrollY;
					left = targetRect.left + targetRect.width / 2 - overlayRect.width / 2 + window.scrollX;
					break;
				case "left":
					top = targetRect.top + targetRect.height / 2 - overlayRect.height / 2 + window.scrollY;
					left = targetRect.left - overlayRect.width - gap + window.scrollX;
					break;
				case "right":
					top = targetRect.top + targetRect.height / 2 - overlayRect.height / 2 + window.scrollY;
					left = targetRect.right + gap + window.scrollX;
					break;
			}

			setPosition({ top, left });
		};

		updatePosition();

		window.addEventListener("scroll", updatePosition);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("scroll", updatePosition);
			window.removeEventListener("resize", updatePosition);
		};
	}, [show, target, placement]);

	// Don't render during SSR or when not showing
	if (!(mounted && show)) return null;

	return createPortal(
		<div ref={overlayRef} className={styles.overlay} style={{ top: position.top, left: position.left }}>
			{children}
		</div>,
		document.body,
	);
}

Overlay.displayName = "Overlay";
