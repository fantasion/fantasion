"use client";

import { FormFeedback, FormGroup, FormText } from "@fantasion/ui";
import classnames from "classnames";
import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import PhoneNumberInput from "react-phone-input-2";
import { useTranslation } from "../lib/i18n-context";
import { FormLabel } from "./FormLabel";
import { describeError } from "./formatters";
import styles from "./forms.module.scss";

type AnyValues = Record<string, unknown>;

type PhoneInputProps<TFieldValues extends FieldValues = AnyValues> = {
	name: Path<TFieldValues>;
	label?: string;
	helpText?: ReactNode;
	required?: boolean;
	className?: string;
	// Allow passing props through to the underlying PhoneNumberInput component
	// without colliding with react-hook-form's own `className` etc.
	[name: string]: unknown;
};

/* -------------------------------------------------------------------------- */
/* PhoneInput                                                                 */
/* -------------------------------------------------------------------------- */

export const PhoneInput = <TFieldValues extends FieldValues = AnyValues>({
	name,
	label,
	helpText,
	required,
	...props
}: PhoneInputProps<TFieldValues>) => {
	const { setValue, register, formState } = useFormContext() as UseFormReturn<TFieldValues>;
	const { t } = useTranslation();
	const fieldError = formState.errors[name];
	register(name);
	const handleChange = (value: string) => {
		setValue(name, `+${value}` as unknown as Parameters<typeof setValue>[1], {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const { name: _ignoredName, className, ...rest } = props;

	return (
		<FormGroup className="mt-2">
			{label && <FormLabel required={required} text={label} />}
			<PhoneNumberInput
				{...(rest as Record<string, unknown>)}
				autocompleteSearch={true}
				containerClass={classnames("form-control", "d-flex", styles.phoneInput, className as string, {
					"is-invalid": Boolean(fieldError),
				})}
				country="cz"
				inputProps={{ name: name as string }}
				onChange={handleChange}
			/>
			{fieldError ? <FormFeedback type="invalid">{describeError(t, fieldError)}</FormFeedback> : null}
			{helpText ? <FormText>{helpText}</FormText> : null}
		</FormGroup>
	);
};
