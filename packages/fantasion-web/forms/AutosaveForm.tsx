"use client";

import { type ReactNode, useEffect, useState } from "react";
import {
	type FieldValues,
	type UseFormProps,
	type UseFormReturn,
	useFormContext,
	type WatchObserver,
} from "react-hook-form";
import { Form } from "./Form";

type AnyValues = Record<string, unknown>;

type AutosaveFormProps<TFieldValues extends FieldValues = AnyValues> = {
	children?: ReactNode;
	defaultValues?: UseFormProps<TFieldValues>["defaultValues"];
	onSubmit: (values: TFieldValues) => undefined | Promise<unknown>;
	[name: string]: unknown;
};

type AutosaveAgentProps<TFieldValues extends FieldValues = AnyValues> = {
	onSubmit: (values: TFieldValues) => Promise<unknown> | unknown;
};

type UseAutoSubmitOptions<TFieldValues extends FieldValues = AnyValues> = {
	trigger: () => Promise<boolean>;
	watch: (observer: WatchObserver<TFieldValues>) => { unsubscribe: () => void };
	onSubmit: (data: TFieldValues) => void;
	excludeFields?: Array<keyof TFieldValues & string>;
	onValidationFailed?: () => void;
};

const AutosaveAgent = <TFieldValues extends FieldValues = AnyValues>({
	onSubmit,
}: AutosaveAgentProps<TFieldValues>) => {
	const { trigger, watch } = useFormContext() as UseFormReturn<TFieldValues>;
	useAutoSubmit<TFieldValues>({
		trigger: trigger,
		watch: watch,
		onSubmit: onSubmit,
	});
	return null;
};

function useAutoSubmit<TFieldValues extends FieldValues = AnyValues>({
	trigger,
	watch,
	onSubmit,
	excludeFields,
	onValidationFailed,
}: UseAutoSubmitOptions<TFieldValues>) {
	const [isSubmiting, setIsSubmiting] = useState(false);
	useEffect(() => {
		const subscription = watch((data, info) => {
			if (info?.type !== "change") {
				return;
			}
			if (info.name && excludeFields?.includes(info.name as keyof TFieldValues & string)) {
				return;
			}
			setIsSubmiting(true);
			trigger()
				.then((valid) => {
					if (valid) {
						onSubmit(data as TFieldValues);
					} else {
						onValidationFailed?.();
					}
				})
				.finally(() => setIsSubmiting(false));
		});
		return () => subscription.unsubscribe();
	}, [excludeFields, watch, onSubmit, onValidationFailed, trigger]);
	return { isSubmiting: isSubmiting };
}

export const AutosaveForm = <TFieldValues extends FieldValues = AnyValues>({
	children,
	defaultValues,
	onSubmit,
	...props
}: AutosaveFormProps<TFieldValues>) => (
	<Form {...props} defaultValues={defaultValues} onSubmit={onSubmit}>
		<AutosaveAgent<TFieldValues> onSubmit={onSubmit} />
		{children}
	</Form>
);
