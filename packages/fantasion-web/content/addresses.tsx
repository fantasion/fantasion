import type React from "react";
import type { FieldValues, Path, Validate } from "react-hook-form";
import { Input } from "../forms/Input";
import styles from "./addresses.module.scss";

// Re-export from fantasion-ui for backward compatibility
export { Address, AddressLine, type AddressProps, OptionalBreak } from "@fantasion/ui";

type InputComponentProps<TFieldValues extends FieldValues = Record<string, unknown>> = {
	name: Path<TFieldValues>;
	onChange?: (e: unknown) => void;
	validate?: Validate<unknown, TFieldValues> | Record<string, Validate<unknown, TFieldValues>>;
	className?: string;
	error?: unknown;
	id?: string;
	label?: string;
	helpText?: React.ReactNode;
	required?: boolean;
	size?: string;
	type?: string;
};

export const PostalCodeInput = <TFieldValues extends FieldValues = Record<string, unknown>>(
	props: InputComponentProps<TFieldValues>,
) => <Input {...props} className={styles.postalCodeInput} />;

export const StreetNumberInput = <TFieldValues extends FieldValues = Record<string, unknown>>(
	props: InputComponentProps<TFieldValues>,
) => <Input {...props} className={styles.streetNumberInput} />;
