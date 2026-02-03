"use client";

import { FormActions } from "@fantasion/ui";
import type { ReactNode } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "../lib/i18n-context";
import { ExtendedFormContext } from "./FormContext";

type FormControlsProps = {
	cancelLabel?: string;
	children?: ReactNode;
	disabled?: boolean;
	onCancel?: () => void;
	size?: "sm" | "lg" | undefined;
	submitLabel: string;
	/** If true, shows generic error message instead of detailed one */
	vague?: boolean;
};

const describeProcessingError = (t: (k: string) => string, err: unknown) => {
	if (err && typeof err === "object") {
		if ("nonFieldErrors" in err && Array.isArray(err.nonFieldErrors)) {
			return err.nonFieldErrors.join(",");
		}
		if ("body" in err && err.body && typeof err.body === "object") {
			const body = err.body as Record<string, unknown>;
			if ("nonFieldErrors" in body && Array.isArray(body.nonFieldErrors)) {
				return body.nonFieldErrors.join(",");
			}
			if ("message" in body) {
				return String(body.message);
			}
		}
	}
	return t("form-failed-to-submit");
};

export const FormControls = ({
	cancelLabel,
	children,
	disabled,
	onCancel,
	size,
	submitLabel,
	vague,
}: FormControlsProps) => {
	const { t } = useTranslation();
	const { formState } = useFormContext();
	const extended = useContext(ExtendedFormContext);
	const processingError = extended?.processingError;

	let errorMessage: string | undefined;
	if (processingError) {
		errorMessage = vague ? t("form-failed-to-submit") : describeProcessingError(t, processingError);
	}

	return (
		<FormActions
			error={errorMessage}
			submitLabel={submitLabel}
			cancelLabel={cancelLabel || t("cancel")}
			onCancel={onCancel}
			isSubmitting={formState.isSubmitting}
			disabled={disabled}
			size={size}
		>
			{children}
		</FormActions>
	);
};
