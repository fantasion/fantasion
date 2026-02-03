import clsx from "clsx";
import {
	type FormHTMLAttributes,
	forwardRef,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type LabelHTMLAttributes,
	type ReactNode,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
} from "react";
import styles from "./Form.module.scss";

// ============================================
// STYLE MAPS
// ============================================

const sizeStyleMap: Record<string, string> = {
	sm: "controlSm",
	lg: "controlLg",
};

const validationStyleMap: Record<string, string> = {
	valid: "controlValid",
	invalid: "controlInvalid",
};

const feedbackStyleMap: Record<string, string> = {
	valid: "feedbackValid",
	invalid: "feedbackInvalid",
};

// ============================================
// FORM
// ============================================

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
	children: ReactNode;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(({ className, children, ...props }, ref) => (
	<form ref={ref} className={clsx(styles.form, className)} {...props}>
		{children}
	</form>
));

Form.displayName = "Form";

// ============================================
// FORM GROUP
// ============================================

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.group, className)} {...props}>
		{children}
	</div>
));

FormGroup.displayName = "FormGroup";

// ============================================
// FORM LABEL
// ============================================

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(({ className, children, ...props }, ref) => (
	<label ref={ref} className={clsx(styles.label, className)} {...props}>
		{children}
	</label>
));

FormLabel.displayName = "FormLabel";

// ============================================
// FORM CONTROL (Input/Textarea)
// ============================================

type FormControlSize = "sm" | "md" | "lg";
type ValidationState = "valid" | "invalid";

export interface FormControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	/** Control size */
	size?: FormControlSize;
	/** Validation state */
	validation?: ValidationState;
	/** Render as textarea instead of input */
	as?: "input" | "textarea";
}

export const FormControl = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormControlProps>(
	({ size = "md", validation, as = "input", className, ...props }, ref) => {
		const classes = clsx(
			styles.control,
			size !== "md" && styles[sizeStyleMap[size]],
			validation && styles[validationStyleMap[validation]],
			className,
		);

		if (as === "textarea") {
			return (
				<textarea
					ref={ref as React.Ref<HTMLTextAreaElement>}
					className={classes}
					{...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
				/>
			);
		}

		return <input ref={ref as React.Ref<HTMLInputElement>} className={classes} {...props} />;
	},
);

FormControl.displayName = "FormControl";

// ============================================
// FORM SELECT
// ============================================

export interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	/** Control size */
	size?: FormControlSize;
	/** Validation state */
	validation?: ValidationState;
	children: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ size = "md", validation, className, children, ...props }, ref) => (
		<select
			ref={ref}
			className={clsx(
				styles.control,
				size !== "md" && styles[sizeStyleMap[size]],
				validation && styles[validationStyleMap[validation]],
				className,
			)}
			{...props}
		>
			{children}
		</select>
	),
);

FormSelect.displayName = "FormSelect";

// ============================================
// FORM CHECK (Checkbox/Radio)
// ============================================

export interface FormCheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	/** Check type */
	type?: "checkbox" | "radio";
	/** Label text */
	label?: ReactNode;
	/** Inline display */
	inline?: boolean;
	/** Render as switch toggle */
	switch?: boolean;
}

export const FormCheck = forwardRef<HTMLInputElement, FormCheckProps>(
	({ type = "checkbox", label, inline, switch: isSwitch, className, id, ...props }, ref) => (
		<div className={clsx(styles.check, inline && styles.checkInline, isSwitch && styles.switch, className)}>
			<input ref={ref} type={type} className={styles.checkInput} id={id} {...props} />
			{label && (
				<label className={styles.checkLabel} htmlFor={id}>
					{label}
				</label>
			)}
		</div>
	),
);

FormCheck.displayName = "FormCheck";

// ============================================
// FORM TEXT (Help text)
// ============================================

export interface FormTextProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const FormText = forwardRef<HTMLDivElement, FormTextProps>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={clsx(styles.text, className)} {...props}>
		{children}
	</div>
));

FormText.displayName = "FormText";

// ============================================
// FORM FEEDBACK (Validation feedback)
// ============================================

export interface FormFeedbackProps extends HTMLAttributes<HTMLDivElement> {
	/** Feedback type */
	type?: "valid" | "invalid";
	children: ReactNode;
}

export const FormFeedback = forwardRef<HTMLDivElement, FormFeedbackProps>(
	({ type = "invalid", className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.feedback, styles[feedbackStyleMap[type]], className)} {...props}>
			{children}
		</div>
	),
);

FormFeedback.displayName = "FormFeedback";

// ============================================
// FLOATING LABEL
// ============================================

export interface FloatingLabelProps extends HTMLAttributes<HTMLDivElement> {
	/** Label text */
	label: string;
	/** Control ID (must match the input's id) */
	controlId: string;
	children: ReactNode;
}

export const FloatingLabel = forwardRef<HTMLDivElement, FloatingLabelProps>(
	({ label, controlId, className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.floating, className)} {...props}>
			{children}
			<label className={styles.label} htmlFor={controlId}>
				{label}
			</label>
		</div>
	),
);

FloatingLabel.displayName = "FloatingLabel";
