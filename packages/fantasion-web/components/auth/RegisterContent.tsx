"use client";

import { Button, Col, Container, Row } from "@fantasion/ui";
import { useState } from "react";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { useTranslation } from "../../lib/i18n-context";
import { useFetch } from "../context";
import { RegisterForm, RegisterFormSuccess } from "./register";

type RegisterFormValues = {
	email?: string;
	password?: string;
	[key: string]: unknown;
};

function RegisterPageContent({ onSubmit }: { onSubmit: (values: RegisterFormValues) => undefined | Promise<unknown> }) {
	const { t } = useTranslation();
	return (
		<Row>
			<Col md={6} lg={5} xl={4} className="mt-4">
				<Heading level={2}>{t("register-with-email")}</Heading>
				<RegisterForm onSubmit={onSubmit} />
			</Col>
			<Col md={6} lg={5} xl={4} className="mt-4">
				<Heading level={2}>{t("register-have-account")}</Heading>
				<div className="mt-2">
					<Link as={Button} route="login">
						{t("register-login")}
					</Link>
				</div>
			</Col>
		</Row>
	);
}

export function RegisterContent() {
	const { t } = useTranslation();
	const fetch = useFetch();
	const [user, setUser] = useState<Record<string, unknown> | null>(null);

	const onSubmit = async (values: RegisterFormValues) => {
		const res = (await fetch.post("/users/register", { body: values })) as unknown as Record<string, unknown>;
		setUser(res);
	};

	return (
		<Container>
			<Heading level={1}>{t("register-title")}</Heading>
			<hr className="mb-0" />
			{user ? <RegisterFormSuccess /> : <RegisterPageContent onSubmit={onSubmit} />}
		</Container>
	);
}
