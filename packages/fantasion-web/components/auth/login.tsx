"use client";

import { useId } from "react";
import { Link } from "../../content/links";
import { Form } from "../../forms/Form";
import { FormControls } from "../../forms/FormControls";
import { Input } from "../../forms/Input";
import { useTranslation } from "../../lib/i18n-context";
import styles from "./login.module.scss";

type LoginFormValues = {
	email: string;
	password: string;
};

type ForgottenPasswordFormValues = {
	email: string;
};

type LoginFormProps = {
	onSubmit: (values: LoginFormValues) => undefined | Promise<unknown>;
};

type ForgottenPasswordFormProps = {
	onSubmit: (values: ForgottenPasswordFormValues) => undefined | Promise<unknown>;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
	const { t } = useTranslation();
	const formId = useId();
	return (
		<Form className={styles.form} id={formId} onSubmit={onSubmit}>
			<Input label={t("login-email")} name="email" type="email" required={true} />
			<Input label={t("login-password")} name="password" type="password" required={true} />
			<FormControls submitLabel={t("login-submit")}>
				<Link className="ms-3" route="forgottenPassword">
					{t("login-forgotten-password")}
				</Link>
			</FormControls>
		</Form>
	);
};

export const ForgottenPasswordForm = ({ onSubmit }: ForgottenPasswordFormProps) => {
	const { t } = useTranslation();
	const formId = useId();
	return (
		<Form className={styles.form} id={formId} onSubmit={onSubmit}>
			<Input label={t("login-email")} name="email" type="email" required={true} />
			<FormControls submitLabel={t("forgotten-password-submit")} />
		</Form>
	);
};
