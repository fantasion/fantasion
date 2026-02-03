"use client";

import { Button, Col, Container, Row } from "@fantasion/ui";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { TOKEN_COOKIE } from "../../api";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { useTranslation } from "../../lib/i18n-context";
import { reverse } from "../../routeMap";
import { useSite } from "../context";
import { LoginForm } from "./login";

export function LoginContent() {
	const { t } = useTranslation();
	const { fetch } = useSite();
	const lang = useLocale();
	const router = useRouter();

	const handleLogin = async (values: Record<string, unknown>) => {
		const res = (await fetch.post("/users/get-token", {
			body: values,
		})) as unknown as { token: string };
		const { token } = res;
		setCookie(TOKEN_COOKIE, token, {
			sameSite: "strict",
		});
		const redirectTo = localStorage.getItem("redirectTo") || reverse(lang, "status");
		router.push(redirectTo);
		localStorage.removeItem("redirectTo");
	};

	return (
		<Container>
			<Heading level={1}>{t("login-title")}</Heading>
			<hr className="mb-0" />
			<Row>
				<Col md={6} lg={5} xl={4} className="mt-4">
					<Heading level={2}>{t("login-with-email")}</Heading>
					<LoginForm onSubmit={handleLogin} />
				</Col>
				<Col md={6} lg={5} xl={4} className="mt-4">
					<Heading level={2}>{t("login-register")}</Heading>
					<p>{t("login-register-general-info")}</p>
					<div className="mt-2">
						<Link as={Button} route="register">
							{t("login-create-account")}
						</Link>
					</div>
				</Col>
			</Row>
		</Container>
	);
}
