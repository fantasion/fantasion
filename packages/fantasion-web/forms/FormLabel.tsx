import { FormLabel as UiFormLabel } from "@fantasion/ui";
import classnames from "classnames";
import styles from "./forms.module.scss";

type FormLabelProps = {
	colon?: boolean;
	formCheck?: boolean;
	required?: boolean;
	text: string;
};

export const FormLabel = ({ colon = true, formCheck, required, text }: FormLabelProps) => (
	<UiFormLabel
		className={classnames(styles.label, {
			"form-check-label": formCheck,
			"fw-bold": required,
		})}
	>
		{text}
		{colon ? ":" : ""}
	</UiFormLabel>
);
