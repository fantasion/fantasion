import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Collapse.module.scss";

// ============================================
// COLLAPSE
// ============================================

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
	/** Whether the collapse is expanded */
	in?: boolean;
	/** Horizontal collapse */
	dimension?: "height" | "width";
	/** Callback when collapse starts */
	onEnter?: () => void;
	/** Callback when collapse finishes opening */
	onEntered?: () => void;
	/** Callback when collapse starts closing */
	onExit?: () => void;
	/** Callback when collapse finishes closing */
	onExited?: () => void;
	children: ReactNode;
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
	(
		{ in: isOpen = false, dimension = "height", onEnter, onEntered, onExit, onExited, className, children, ...props },
		ref,
	) => {
		const [status, setStatus] = useState<"collapsed" | "collapsing" | "expanded" | "expanding">(
			isOpen ? "expanded" : "collapsed",
		);
		const contentRef = useRef<HTMLDivElement>(null);
		const [size, setSize] = useState<number | undefined>(undefined);

		useEffect(() => {
			if (isOpen && status === "collapsed") {
				// Start expanding
				onEnter?.();
				setStatus("expanding");

				// Get the full size
				if (contentRef.current) {
					const fullSize = dimension === "height" ? contentRef.current.scrollHeight : contentRef.current.scrollWidth;
					setSize(fullSize);
				}

				// Finish expanding after animation
				const timer = setTimeout(() => {
					setStatus("expanded");
					setSize(undefined);
					onEntered?.();
				}, 350);

				return () => clearTimeout(timer);
			}

			if (!isOpen && status === "expanded") {
				// Start collapsing
				onExit?.();

				// Set current size first
				if (contentRef.current) {
					const currentSize = dimension === "height" ? contentRef.current.scrollHeight : contentRef.current.scrollWidth;
					setSize(currentSize);
				}

				// Force reflow, then collapse
				requestAnimationFrame(() => {
					setStatus("collapsing");
					setSize(0);
				});

				// Finish collapsing after animation
				const timer = setTimeout(() => {
					setStatus("collapsed");
					setSize(undefined);
					onExited?.();
				}, 350);

				return () => clearTimeout(timer);
			}
		}, [isOpen, status, dimension, onEnter, onEntered, onExit, onExited]);

		const style: React.CSSProperties = {
			...props.style,
			...(size !== undefined && { [dimension]: size }),
		};

		if (status === "collapsed") {
			return null;
		}

		return (
			<div
				ref={contentRef}
				className={clsx(
					styles.collapse,
					status === "expanded" && styles.show,
					(status === "collapsing" || status === "expanding") && styles.collapsing,
					dimension === "width" && styles.horizontal,
					className,
				)}
				style={style}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Collapse.displayName = "Collapse";
