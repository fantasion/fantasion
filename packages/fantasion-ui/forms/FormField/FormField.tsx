import clsx from "clsx";
import {
	type ComponentType,
	type ElementType,
	forwardRef,
	type InputHTMLAttributes,
	type ReactNode,
	type SelectHTMLAttributes,
} from "react";
import { FormControl, FormFeedback, FormGroup, FormLabel, FormSelect, FormText } from "../Form.js";
import styles from "./FormField.module.scss";

type FormFieldSize = "sm" | "md" | "lg";

export interface FormFieldProps
	extends Omit<InputHTMLAttributes<HTMLInputElement> & SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	/** Render as different element type */
	as?: ElementType | ComponentType<unknown>;
	/** Additional class name */
	className?: string;
	/** Error message to display */
	error?: ReactNode;
	/** Field label */
	label?: string;
	/** Append colon after label */
	labelColon?: boolean;
	/** Options for select fields */
	options?: Array<{ value: string; label: string }>;
	/** Help text shown below the field */
	helpText?: ReactNode;
	/** Whether the field is required */
	required?: boolean;
	/** Field size */
	size?: FormFieldSize;
	/** Input type */
	type?: string;
	/** Placeholder for empty select option */
	emptyOptionLabel?: string;
}

const sizeClassMap: Record<FormFieldSize, string> = {
	sm: "fieldSm",
	md: "fieldMd",
	lg: "fieldLg",
};

const resolveComponent = (
	type?: string,
	as?: ElementType | ComponentType<unknown>,
): ElementType | ComponentType<unknown> => {
	if (as) {
		return as;
	}
	if (type === "checkbox" || type === "radio") {
		return "input";
	}
	if (type === "select") {
		return FormSelect;
	}
	return FormControl;
};

const resolveAsType = (type?: string): "input" | "textarea" | "select" | undefined => {
	if (type === "checkbox" || type === "radio") {
		return;
	}
	if (type === "select") {
		return "select";
	}
	if (type === "textarea") {
		return "textarea";
	}
	return "input";
};

const isLabelRight = (type?: string) => type === "checkbox" || type === "radio";

const renderOptions = (
	options: Array<{ value: string; label: string }> | undefined,
	required: boolean | undefined,
	emptyOptionLabel: string,
): ReactNode => {
	if (!options) {
		return null;
	}

	const mapped = options.map((option) => (
		<option key={option.value} value={option.value}>
			{option.label}
		</option>
	));

	if (!required) {
		mapped.unshift(
			<option value="" key="__empty__">
				{emptyOptionLabel}
			</option>,
		);
	}

	return mapped;
};

/**
 * FormField - A compound form field component that combines label, input, and validation feedback.
 *
 * This is a presentational component without form library integration.
 * Use it with any form library by passing value, onChange, and error props.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={errors.email}
 *   required
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, FormFieldProps>(
	(
		{
			as,
			className,
			error,
			id,
			label,
			labelColon = true,
			name,
			options,
			helpText,
			required,
			size = "md",
			type,
			disabled,
			emptyOptionLabel = "- - -",
			...props
		},
		ref,
	) => {
		const rightLabel = isLabelRight(type);
		const controlId = id || (name ? `field-${name}` : undefined);
		const Component = resolveComponent(type, as);
		const hasError = Boolean(error);

		return (
			<FormGroup
				className={clsx(styles.field, styles[sizeClassMap[size]], className, {
					"form-check": rightLabel,
				})}
			>
				{label && !rightLabel && (
					<FormLabel
						htmlFor={controlId}
						className={clsx(styles.label, {
							[styles.required]: required,
						})}
					>
						{label}
						{labelColon ? ":" : ""}
					</FormLabel>
				)}
				<Component
					as={resolveAsType(type)}
					disabled={disabled}
					validation={hasError ? "invalid" : undefined}
					name={name}
					type={type}
					id={controlId}
					className={clsx({ "is-invalid": hasError })}
					ref={ref}
					{...props}
				>
					{renderOptions(options, required, emptyOptionLabel)}
				</Component>
				{label && rightLabel && (
					<FormLabel
						htmlFor={controlId}
						className={clsx(styles.label, styles.checkLabel, {
							[styles.required]: required,
						})}
					>
						{label}
					</FormLabel>
				)}
				{hasError && <FormFeedback type="invalid">{error}</FormFeedback>}
				{helpText && <FormText>{helpText}</FormText>}
			</FormGroup>
		);
	},
);

FormField.displayName = "FormField";
