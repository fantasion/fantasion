"use client";

import { Col, Collapse, Container, Row } from "@fantasion/ui";
import { useState } from "react";
import { Heading } from "../../content/content";
import { useTranslation } from "../../lib/i18n-context";
import { useAlerts, useSite } from "../context";
import { ForgottenPasswordForm } from "./login";
import { CreatePasswordForm } from "./register";

type ForgottenPasswordContentProps = {
	secret: string | null;
	token: string | null;
};

const restorePassword = async (
	fetch: { post: (url: string, options: { body: unknown }) => Promise<unknown> },
	values: Record<string, unknown>,
) =>
	await fetch.post("/users/restore-password", {
		body: values,
	});

export function ForgottenPasswordContent({ secret, token }: ForgottenPasswordContentProps) {
	const alerts = useAlerts();
	const { fetch } = useSite();
	const { t } = useTranslation();
	const [submitted, setSubmitted] = useState<boolean | undefined>();

	const requestPasswordRestore = async (values: Record<string, unknown>) => {
		await restorePassword(fetch, values);
		setSubmitted(true);
		alerts.add({
			id: "renewed-password",
			severity: "success",
			text: t("forgotten-password-submitted"),
		});
	};

	let content = (
		<div>
			<Heading level={1}>{t("forgotten-password-title")}</Heading>
			<hr />
			<div>
				<p>{t("forgotten-password-description")}</p>
				<ForgottenPasswordForm onSubmit={requestPasswordRestore} />
			</div>
		</div>
	);

	if (token) {
		const createPassword = async (values: Record<string, unknown>) => {
			await fetch.post(`/users/create-password/${secret}`, {
				body: values,
			});
			setSubmitted(true);
			alerts.add({
				id: "restored-password",
				severity: "success",
				text: t("forgotten-password-restored"),
			});
		};
		content = (
			<div>
				<Heading level={1}>{t("restore-password-title")}</Heading>
				<hr />
				<div>
					<p>{t("restore-password-description")}</p>
					<CreatePasswordForm onSubmit={createPassword} />
				</div>
			</div>
		);
	}

	return (
		<Container>
			<Row>
				<Col lg={{ offset: 3, span: 6 }}>
					<Collapse in={!submitted}>{content}</Collapse>
				</Col>
			</Row>
		</Container>
	);
}
