"use client";

import { useId } from "react";
import { Form } from "../forms/Form";
import { FormControls } from "../forms/FormControls";
import { FormError } from "../forms/FormError";
import { Input } from "../forms/Input";
import { useTranslation } from "../lib/i18n-context";
import styles from "./contact.module.scss";

export const ContactForm = () => {
	const { t } = useTranslation();
	const formId = useId();
	return (
		<Form className={styles.form} id={formId}>
			<Input label={t("contact-form-email")} name="email" type="email" required={true} />
			<div className="flex-shrink-1 flex-grow-0">
				<Input
					label={t("contact-form-message")}
					name="message"
					type="textarea"
					placeholder={t("contact-form-placeholder")}
					rows={5}
					required={true}
				/>
			</div>
			<FormError />
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<FormControls submitLabel={t("contact-form-submit")} />
			</div>
		</Form>
	);
};
