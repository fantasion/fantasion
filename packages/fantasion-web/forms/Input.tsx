"use client";

import { FormControl, FormFeedback, FormGroup, FormSelect, FormText } from "@fantasion/ui";
import classnames from "classnames";
import { type ComponentType, type ElementType, type ForwardedRef, forwardRef, type ReactNode, useContext } from "react";
import type { ChangeHandler, FieldValues, Path, UseFormReturn, Validate } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "../lib/i18n-context";
import { ExtendedFormContext } from "./FormContext";
import { FormLabel } from "./FormLabel";
import styles from "./forms.module.scss";

type AnyValues = Record<string, unknown>;

type FormlessInputProps = {
	as?: ElementType | ComponentType<unknown>;
	className?: string;
	error?: unknown;
	id?: string;
	label?: string;
	// name is required for the rendered input, but the internal
	// forwardRef helper will supply it, so make it optional here.
	name?: string;
	options?: Array<{ value: string; label: string }>;
	helpText?: ReactNode;
	required?: boolean;
	size?: "default" | "sm" | "lg" | string;
	type?: string;
	value?: unknown;
	[name: string]: unknown;
};

type InputProps<TFieldValues extends FieldValues = AnyValues> = {
	name: Path<TFieldValues>;
	onChange?: (e: unknown) => void;
	validate?: Validate<unknown, TFieldValues> | Record<string, Validate<unknown, TFieldValues>>;
	[name: string]: unknown;
};

const resolveType = (type?: string) => {
	if (type === "checkbox") {
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

const resolveComponent = (type?: string, as?: ElementType | ComponentType<unknown>) => {
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

const emptyOptionsLabel = "- - -";
const rightLabelMap = ["checkbox", "radio"];

const isLabelRight = (type?: string) => (type ? rightLabelMap.includes(type) : false);

const getOptions = (options?: Array<{ value: string; label: string }>, required?: boolean) => {
	let opts: ReactNode = null;
	if (options) {
		const mapped = options.map((option) => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		));

		if (!required) {
			mapped.unshift(
				<option value="" key={null}>
					{emptyOptionsLabel}
				</option>,
			);
		}
		opts = mapped;
	}
	return opts;
};

const describeError = (t: (key: string) => string, error: unknown) => {
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	if (typeof error === "string") {
		return error;
	}
	if (error && typeof error === "object" && "type" in error) {
		return t(`error-input-${String(error.type)}`);
	}
	return t("error-unknown");
};

const getChangeWrapper = (field: { onChange: ChangeHandler }, onChange: (e: unknown) => void) => (e: unknown) => {
	onChange(e);
	field.onChange(e as React.ChangeEvent<HTMLInputElement>);
};

// Helper to generate the control ID
function generateControlId(params: {
	id: string | undefined;
	formId: string | undefined;
	name: string;
	isRightLabel: boolean;
	value: unknown;
}): string {
	if (params.id) {
		return params.id;
	}
	const baseId = `${params.formId ?? "form"}-${params.name}`;
	return params.isRightLabel && params.value !== undefined ? `${baseId}-${String(params.value)}` : baseId;
}

// Helper to build input-specific props based on type
function buildInputProps(
	type: string | undefined,
	currentValue: unknown,
	props: Record<string, unknown>,
): Record<string, unknown> {
	const inputProps: Record<string, unknown> = {};

	if (type === "checkbox") {
		inputProps.value = "value" in props && props.value != null ? props.value : "true";
		return inputProps;
	}

	if (type === "radio") {
		inputProps.checked = currentValue === ("value" in props ? props.value : undefined);
		inputProps.value = "value" in props ? props.value : undefined;
		return inputProps;
	}

	return inputProps;
}

const BaseFormlessInput = (
	{
		as,
		className,
		error,
		id,
		label,
		name,
		options,
		helpText,
		required,
		size = "default",
		type,
		...props
	}: FormlessInputProps,
	ref: ForwardedRef<HTMLElement>,
) => {
	if (!name) {
		throw new Error("FormlessInput requires a name");
	}
	const extended = useContext(ExtendedFormContext);
	const formCtx = useFormContext() as unknown as UseFormReturn<AnyValues>;
	const { formState, watch } = extended ?? formCtx;

	const { t } = useTranslation();
	const rightLabel = isLabelRight(type);
	const controlId = generateControlId({
		id: id,
		formId: extended?.formId,
		name: name,
		isRightLabel: rightLabel,
		value: "value" in props ? props.value : undefined,
	});
	const htmlOptions = getOptions(options, required);
	// biome-ignore lint/suspicious/noExplicitAny: Component type is dynamic based on input type
	const Component = resolveComponent(type, as) as any;
	const fieldError = error || formState.errors[name as keyof typeof formState.errors];
	const currentValue = watch(name);
	const inputProps = buildInputProps(type, currentValue, props);

	return (
		<FormGroup
			className={classnames("mt-2", {
				"form-check": rightLabel,
			})}
		>
			{label && !rightLabel ? <FormLabel required={required} text={label} /> : null}
			<Component
				// biome-ignore lint/suspicious/noExplicitAny: Type is determined dynamically based on input type
				as={resolveType(type) as any}
				disabled={formState.isSubmitting}
				validation={fieldError ? "invalid" : undefined}
				name={name as string}
				type={type}
				id={controlId}
				{...inputProps}
				{...props}
				className={classnames(styles[size], className, { "is-invalid": Boolean(fieldError) })}
				ref={ref}
			>
				{htmlOptions}
			</Component>
			{label && rightLabel ? <FormLabel colon={false} text={label} required={required} formCheck={true} /> : null}
			{fieldError ? <FormFeedback type="invalid">{describeError(t, fieldError)}</FormFeedback> : null}
			{helpText ? <FormText>{helpText}</FormText> : null}
		</FormGroup>
	);
};

const FormlessInput = forwardRef<HTMLElement, FormlessInputProps>((props, ref) => BaseFormlessInput(props, ref));

export const Input = <TFieldValues extends FieldValues = AnyValues>({
	name,
	onChange,
	validate,
	...props
}: InputProps<TFieldValues>) => {
	const { register } = useFormContext() as UseFormReturn<TFieldValues>;
	const field = register(name, {
		setValueAs: (v: unknown) => (v === "" || v === undefined ? null : v),
		validate: validate,
	});
	const handleChange = onChange ? getChangeWrapper(field, onChange) : field.onChange;
	return <FormlessInput {...props} {...field} name={name as string} onChange={handleChange} />;
};
