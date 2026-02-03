"use client";

import { Alert, Col, Container, Row } from "@fantasion/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { z } from "zod";
import { Link } from "../../content/links";
import { Form } from "../../forms/Form";
import { FormControls } from "../../forms/FormControls";
import { Input } from "../../forms/Input";
import { PhoneInput } from "../../forms/PhoneInput";
import { Trans, useTranslation } from "../../lib/i18n-context";
import { PasswordStrengthInput } from "../passwords";

const NAME_MAX_LENGTH = 127;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 255;

type RegisterFormValues = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	privacy: boolean;
};

type CreatePasswordFormValues = {
	password: string;
	passwordConfirm: string;
};

type RegisterFormProps = {
	onSubmit: (values: RegisterFormValues) => undefined | Promise<unknown>;
};

type CreatePasswordFormProps = {
	onSubmit: (values: CreatePasswordFormValues) => undefined | Promise<unknown>;
};

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
	const { t } = useTranslation();
	const formId = useId();

	const registerSchema = z.object({
		firstName: z.string().min(1, t("form-input-required")).max(NAME_MAX_LENGTH, t("form-input-max-length")),
		lastName: z.string().min(1, t("form-input-required")).max(NAME_MAX_LENGTH, t("form-input-max-length")),
		email: z.string().email(t("form-input-email")),
		phone: z.string().min(1, t("form-input-required")),
		privacy: z.literal(true),
	});

	return (
		<Form id={formId} onSubmit={onSubmit} resolver={zodResolver(registerSchema)}>
			<Input label={t("user-first-name")} name="firstName" type="text" required={true} />
			<Input label={t("user-last-name")} name="lastName" type="text" required={true} />
			<Input helpText={t("user-email-help-text")} label={t("user-email")} name="email" type="email" required={true} />
			<PhoneInput
				helpText={t("user-phone-number-help-text")}
				label={t("user-phone-number")}
				name="phone"
				type="tel"
				required={true}
			/>
			<Input
				label={
					<Trans
						i18nKey="consent-with"
						values={{ subject: t("personal-information-processing") }}
						components={[
							<Link external={true} key="privacyPolicy" route="privacyPolicy">
								{t("personal-information-processing")}
							</Link>,
						]}
					/>
				}
				name="privacy"
				type="checkbox"
				required={true}
			/>
			<FormControls submitLabel={t("register-submit")} />
		</Form>
	);
};

export const RegisterFormSuccess = () => {
	const { t } = useTranslation();
	return (
		<Container>
			<Row>
				<Col lg={{ span: 6, offset: 3 }} className="mt-4">
					<Alert variant="success">{t("register-success")}</Alert>
					<p>{t("register-success-info")}</p>
				</Col>
			</Row>
		</Container>
	);
};

export const CreatePasswordForm = ({ onSubmit }: CreatePasswordFormProps) => {
	const { t } = useTranslation();
	const formId = useId();

	const passwordSchema = z
		.object({
			password: z
				.string()
				.min(PASSWORD_MIN_LENGTH, t("form-input-min-length"))
				.max(PASSWORD_MAX_LENGTH, t("form-input-max-length")),
			passwordConfirm: z
				.string()
				.min(PASSWORD_MIN_LENGTH, t("form-input-min-length"))
				.max(PASSWORD_MAX_LENGTH, t("form-input-max-length")),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			path: ["passwordConfirm"],
			message: t("form-input-required"),
		});

	return (
		<Form id={formId} onSubmit={onSubmit} resolver={zodResolver(passwordSchema)}>
			<Input
				as={PasswordStrengthInput}
				helpText={t("user-password-help-text")}
				label={t("user-password")}
				name="password"
				type="password"
			/>
			<Input
				helpText={t("user-password-confirm-help-text")}
				label={t("user-password-confirm")}
				name="passwordConfirm"
				type="password"
			/>
			<FormControls submitLabel={t("verification-finish")} />
		</Form>
	);
};
