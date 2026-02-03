import type { FieldValues } from "react-hook-form";
import styles from "./forms.module.scss";
import { Input } from "./Input";
import type { InputComponentProps } from "./types";

export const PostalCodeInput = <TFieldValues extends FieldValues = Record<string, unknown>>(
	props: InputComponentProps<TFieldValues>,
) => <Input {...props} className={styles.postalCodeInput} />;
