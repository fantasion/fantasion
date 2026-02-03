import type { FieldValues, Path, Validate } from "react-hook-form";

export type InputComponentProps<TFieldValues extends FieldValues = Record<string, unknown>> = {
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
