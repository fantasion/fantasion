import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Badge } from "../../Badge/index.js";
import { Button } from "../../buttons/index.js";
import styles from "./SelectBubble.module.scss";

export interface SelectBubbleProps extends HTMLAttributes<HTMLSpanElement> {
	/** The label text displayed in the bubble */
	label: ReactNode;
	/** Optional tooltip/description content */
	tooltip?: ReactNode;
	/** Called when the remove button is clicked */
	onRemove?: () => void;
	/** Icon component to use for the remove button */
	removeIcon?: ReactNode;
	/** Whether the bubble is disabled */
	disabled?: boolean;
}

/**
 * SelectBubble - A tag/chip component for displaying selected items.
 *
 * Used in multi-select inputs to show selected values as removable chips.
 *
 * @example
 * ```tsx
 * <SelectBubble
 *   label="JavaScript"
 *   onRemove={() => handleRemove('javascript')}
 *   removeIcon={<XIcon />}
 * />
 * ```
 */
export const SelectBubble = forwardRef<HTMLSpanElement, SelectBubbleProps>(
	({ label, tooltip, onRemove, removeIcon, disabled, className, ...props }, ref) => (
		<Badge
			ref={ref}
			className={clsx(styles.bubble, className)}
			title={typeof tooltip === "string" ? tooltip : undefined}
			{...props}
		>
			<span className={styles.label}>{label}</span>
			{onRemove && (
				<Button
					className={styles.removeButton}
					onClick={onRemove}
					disabled={disabled}
					variant="inline"
					icon={true}
					aria-label="Remove"
				>
					{removeIcon || "×"}
				</Button>
			)}
		</Badge>
	),
);

SelectBubble.displayName = "SelectBubble";
