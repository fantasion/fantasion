"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { useTranslation } from "../../lib/i18n-context";
import { ContactCard } from "../ContactCard";
import { GeneralNewsletterForm } from "../GeneralNewsletterForm";

export function SignupContent() {
	const { t } = useTranslation();
	return (
		<Container>
			<Row>
				<Col md={6}>
					<h1>{t("contacts-title")}</h1>
					<ContactCard />
				</Col>
				<Col md={6}>
					<GeneralNewsletterForm className="mt-3" hideTitle={true} />
				</Col>
			</Row>
		</Container>
	);
}
