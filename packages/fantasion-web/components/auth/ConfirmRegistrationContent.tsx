"use client";

import { Col, Collapse, Container, Row } from "@fantasion/ui";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TOKEN_COOKIE } from "../../api";
import { Heading } from "../../content/content";
import { useTranslation } from "../../lib/i18n-context";
import { useAlerts, useSite } from "../context";
import { CreatePasswordForm } from "./register";

type ConfirmRegistrationContentProps = {
	secret: string;
};

export function ConfirmRegistrationContent({ secret }: ConfirmRegistrationContentProps) {
	const { fetch, user } = useSite();
	const { t } = useTranslation();
	const [verified, setVerified] = useState(user?.passwordCreated);
	const alerts = useAlerts();
	const router = useRouter();

	const onSubmit = async (values: Record<string, unknown>) => {
		const res = (await fetch.post(`/users/create-password/${secret}`, {
			body: values,
		})) as unknown as { token: string; user: { passwordCreated: boolean } };
		setCookie(TOKEN_COOKIE, res.token, {
			sameSite: "strict",
		});
		setVerified(res.user.passwordCreated);
		alerts.add({
			id: "verification-finished",
			severity: "success",
			text: t("verification-finished"),
		});

		const redirectTo = localStorage.getItem("redirectTo");
		if (redirectTo) {
			router.push(redirectTo);
			localStorage.removeItem("redirectTo");
		}
	};

	return (
		<Container>
			<Row>
				<Col lg={{ offset: 3, span: 6 }}>
					<Collapse in={!verified}>
						<div>
							<Heading level={1}>{t("verification-title")}</Heading>
							<hr />
							<div>
								<p>{t("verification-success")}</p>
								<CreatePasswordForm onSubmit={onSubmit} />
							</div>
						</div>
					</Collapse>
				</Col>
			</Row>
		</Container>
	);
}
