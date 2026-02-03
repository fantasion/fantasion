"use client";

import { Form as UiForm } from "@fantasion/ui";
import {
	createContext,
	type FormEvent,
	type ForwardedRef,
	forwardRef,
	type ReactNode,
	useCallback,
	useState,
} from "react";
import type { FieldValues, Path, UseFormProps, UseFormReturn } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";

type AnyValues = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/* Prop types                                                                 */
/* -------------------------------------------------------------------------- */

type ControlledFormProps = {
	children?: ReactNode;
	id?: string;
	onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
	// allow passing any extra bootstrap form props
	[name: string]: unknown;
};

type FormProps<TFieldValues extends FieldValues = AnyValues> = {
	defaultValues?: UseFormProps<TFieldValues>["defaultValues"];
	children?: ReactNode;
	id?: string;
	onSubmit?: (values: TFieldValues) => undefined | Promise<unknown>;
	resolver?: UseFormProps<TFieldValues>["resolver"];
	// allow passing any extra bootstrap form props
	[name: string]: unknown;
};

/* -------------------------------------------------------------------------- */
/* ControlledForm / Form                                                      */
/* -------------------------------------------------------------------------- */

const ReflessControlledForm = (
	{ children, id, onSubmit, ...props }: ControlledFormProps,
	ref: ForwardedRef<HTMLFormElement>,
) => (
	<UiForm noValidate={true} id={id} onSubmit={onSubmit} ref={ref} {...props}>
		{children}
	</UiForm>
);

export const ControlledForm = forwardRef<HTMLFormElement, ControlledFormProps>(ReflessControlledForm);

type ExtendedFormContextValue = UseFormReturn<AnyValues> & {
	formId?: string;
	processingError: unknown | null;
};

const ExtendedFormContext = createContext<ExtendedFormContextValue | null>(null);

// Helper function to process field errors and set them on the form
function processFieldErrors<TFieldValues extends FieldValues>(
	errorBody: Record<string, unknown>,
	setError: UseFormReturn<TFieldValues>["setError"],
) {
	const formErrors = Object.entries(errorBody).filter(([key]) => key !== "nonFieldErrors");
	for (const [field, fieldErrors] of formErrors) {
		if (Array.isArray(fieldErrors)) {
			for (const fieldError of fieldErrors) {
				setError(field as Path<TFieldValues>, { message: String(fieldError) });
			}
		}
	}
}

// Helper function to handle form submission errors
function handleFormError<TFieldValues extends FieldValues>(
	error: unknown,
	setProcessingError: (err: unknown) => void,
	setError: UseFormReturn<TFieldValues>["setError"],
) {
	setProcessingError(error);
	// @FIXME This error should be reported to Sentry
	// biome-ignore lint/suspicious/noConsole: Error should be reported to Sentry
	console.error(error);

	const err = error as { body?: Record<string, unknown> } | undefined;
	if (err?.body) {
		processFieldErrors(err.body, setError);
	}
}

const ReflessForm = <TFieldValues extends FieldValues = AnyValues>(
	{ defaultValues, children, id, onSubmit, resolver, ...props }: FormProps<TFieldValues>,
	ref: ForwardedRef<HTMLFormElement>,
) => {
	if (!onSubmit) {
		throw new Error("Form requires an onSubmit handler");
	}
	const [processingError, setProcessingError] = useState<unknown | null>(null);
	const methods = useForm<TFieldValues>({ defaultValues: defaultValues, resolver: resolver });
	const { handleSubmit, setError } = methods;

	const protectedSubmit = useCallback(
		async (values: TFieldValues) => {
			try {
				setProcessingError(null);
				return await onSubmit(values);
			} catch (e: unknown) {
				handleFormError(e, setProcessingError, setError);
			}
		},
		[onSubmit, setError],
	);

	return (
		<FormProvider {...methods}>
			<ExtendedFormContext.Provider
				value={{ ...(methods as UseFormReturn<AnyValues>), formId: id, processingError: processingError }}
			>
				<ControlledForm {...props} id={id} onSubmit={handleSubmit(protectedSubmit)} ref={ref}>
					{children}
				</ControlledForm>
			</ExtendedFormContext.Provider>
		</FormProvider>
	);
};

function InnerForm<TFieldValues extends FieldValues = AnyValues>(
	props: FormProps<TFieldValues>,
	ref: ForwardedRef<HTMLFormElement>,
) {
	return ReflessForm<TFieldValues>(props, ref);
}
// biome-ignore lint/style/useComponentExportOnlyModules: This is a component
export const Form = forwardRef(InnerForm) as <TFieldValues extends FieldValues = AnyValues>(
	props: FormProps<TFieldValues> & { ref?: ForwardedRef<HTMLFormElement> },
) => ReturnType<typeof ReflessForm<TFieldValues>>;
