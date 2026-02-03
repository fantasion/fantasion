import { createContext } from "react";
import type { UseFormReturn } from "react-hook-form";

type AnyValues = Record<string, unknown>;

type ExtendedFormContextValue = UseFormReturn<AnyValues> & {
	formId?: string;
	processingError: unknown | null;
};

export const ExtendedFormContext = createContext<ExtendedFormContextValue | null>(null);
