import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { InteractiveButton } from "../../buttons/CopyButton/CopyButton.js";
import { FormErrorAlert } from "../FormErrorAlert/index.js";
import styles from "./FormActions.module.scss";

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
	/** Error message to display above the buttons */
	error?: ReactNode;
	/** Primary submit button label */
	submitLabel: ReactNode;
	/** Cancel button label (if onCancel is provided) */
	cancelLabel?: ReactNode;
	/** Called when cancel button is clicked */
	onCancel?: () => void;
	/** Whether form is currently submitting */
	isSubmitting?: boolean;
	/** Whether form actions are disabled */
	disabled?: boolean;
	/** Button size */
	size?: "sm" | "lg";
	/** Additional content between error and buttons */
	children?: ReactNode;
}

/**
 * FormActions - Layout component for form submit/cancel buttons with error display.
 *
 * Provides consistent spacing and layout for form action buttons.
 *
 * @example
 * ```tsx
 * <FormActions
 *   submitLabel="Save"
 *   cancelLabel="Cancel"
 *   onCancel={() => router.back()}
 *   isSubmitting={formState.isSubmitting}
 *   error={submitError}
 * />
 * ```
 */
export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
	({ error, submitLabel, cancelLabel, onCancel, isSubmitting, disabled, size, children, className, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.actions, className)} {...props}>
			<FormErrorAlert error={error} />
			<div className={styles.buttons}>
				<InteractiveButton type="submit" disabled={disabled} inProgress={isSubmitting} size={size}>
					{submitLabel}
				</InteractiveButton>
				{children}
				{onCancel && (
					<InteractiveButton
						className={styles.cancelButton}
						disabled={disabled}
						type="button"
						variant="secondary"
						size={size}
						onClick={onCancel}
					>
						{cancelLabel}
					</InteractiveButton>
				)}
			</div>
		</div>
	),
);

FormActions.displayName = "FormActions";
