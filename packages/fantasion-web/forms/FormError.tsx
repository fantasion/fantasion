"use client";

import { FormErrorAlert } from "@fantasion/ui";
import { useContext } from "react";
import { useTranslation } from "../lib/i18n-context";
import { ExtendedFormContext } from "./FormContext";

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

type FormErrorProps = {
	vague?: boolean;
};

export const FormError = ({ vague }: FormErrorProps) => {
	const extended = useContext(ExtendedFormContext);
	const processingError = extended?.processingError;
	const { t } = useTranslation();

	if (!processingError) {
		return null;
	}

	const errorMessage = vague ? t("form-failed-to-submit") : describeProcessingError(t, processingError);

	return <FormErrorAlert error={errorMessage} />;
};
