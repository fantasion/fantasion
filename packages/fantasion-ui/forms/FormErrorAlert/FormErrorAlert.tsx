import type { ReactNode } from "react";
import { Alert } from "../../Alert/index.js";
import styles from "./FormErrorAlert.module.scss";

export interface FormErrorAlertProps {
	/** Error message to display. If falsy, nothing is rendered. */
	error?: ReactNode;
	/** Additional class name */
	className?: string;
}

/**
 * FormErrorAlert - Displays a form-level error message in an alert box.
 *
 * Use this for non-field errors (e.g., submission failures, server errors).
 *
 * @example
 * ```tsx
 * <FormErrorAlert error={submitError} />
 * ```
 */
export const FormErrorAlert = ({ error, className }: FormErrorAlertProps) => {
	if (!error) {
		return null;
	}

	return (
		<div className={styles.container}>
			<Alert variant="danger" className={className}>
				{error}
			</Alert>
		</div>
	);
};

FormErrorAlert.displayName = "FormErrorAlert";
