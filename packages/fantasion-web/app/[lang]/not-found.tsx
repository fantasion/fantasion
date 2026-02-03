"use client";

import { Container } from "@fantasion/ui";
import { GenericPage } from "../../components/layout";
import { MetaPage } from "../../components/meta";
import { useTranslation } from "../../lib/i18n-context";

/**
 * App Router 404 handler.
 */
export default function NotFoundPage() {
	const { t } = useTranslation();

	return (
		<GenericPage>
			<MetaPage title={t("page-not-found")} description={t("page-not-found-description")} />
			<Container className="d-flex">
				<div className="m-auto text-center">
					<h1>{t("page-not-found")}</h1>
					<p>{t("page-not-found-description")}</p>
				</div>
			</Container>
		</GenericPage>
	);
}
