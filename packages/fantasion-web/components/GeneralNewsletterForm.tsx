"use client";

import { Button, type ButtonVariant, Col, FormControl, FormGroup, FormLabel } from "@fantasion/ui";
import classNames from "classnames";
import { useTranslation } from "../lib/i18n-context";
import styles from "./GeneralNewsletterForm.module.scss";

type GeneralNewsletterFormProps = {
	title?: string;
	hideTitle: boolean;
	variant?: ButtonVariant;
	className?: string;
	[key: string]: unknown;
};

export const GeneralNewsletterForm = ({
	title,
	hideTitle,
	variant = "primary",
	...props
}: GeneralNewsletterFormProps) => {
	const { t } = useTranslation();
	return (
		<>
			{hideTitle ? null : <h2 {...props}>{title || t("newsletter-general-title")}</h2>}
			<form
				action="https://fantasion.us20.list-manage.com/subscribe/post?u=7af44209676d38653a2a4a1a0&amp;id=a01ed947e0"
				method="post"
				name="mc-embedded-subscribe-form"
				className="validate"
				target="_blank"
				noValidate={true}
				rel="noopener"
			>
				<FormGroup>
					<FormLabel htmlFor="mce-EMAIL">{t("label-with-colon", { label: t("newsletter-your-email") })}</FormLabel>
					<Col>
						{/* biome-ignore lint/correctness/useUniqueElementIds: ID required by Mailchimp API */}
						<FormControl
							type="email"
							name="EMAIL"
							className={classNames(styles.emailField)}
							id="mce-EMAIL"
							required={true}
						/>
					</Col>
				</FormGroup>
				<input type="hidden" name="b_7af44209676d38653a2a4a1a0_a01ed947e0" tabIndex={-1} value="" />
				<input type="hidden" name="subscribe" tabIndex={-1} value="" />
				<div className="mt-3">
					<Button type="submit" className="button" variant={variant}>
						{t("newsletter-submit")}
					</Button>
				</div>
			</form>
		</>
	);
};
