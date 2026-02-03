"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { SiteLogo } from "../components/SiteLogo";
import { Link } from "../content/links";
import { SocialNetworks } from "../content/social";
import { useTranslation } from "../lib/i18n-context";
import styles from "./Footer.module.scss";

type FooterLinkProps = {
	route: string;
	label: string;
};

const FooterLink = ({ route, label }: FooterLinkProps) => (
	<li>
		<Link route={route}>{label}</Link>
	</li>
);

const FooterLinks = () => {
	const { t } = useTranslation();
	return (
		<nav>
			<ul className={styles.quickLinks}>
				<FooterLink route="codex" label={t("codex-title")} />
				<FooterLink route="cookiesPolicy" label={t("cookies")} />
				<FooterLink route="privacyPolicy" label={t("personal-information")} />
			</ul>
			<ul className={styles.quickLinks}>
				<FooterLink route="termsAndConditions" label={t("terms-and-conditions")} />
				<FooterLink route="faq" label={t("faq-link")} />
			</ul>
		</nav>
	);
};

const CopyrightNotice = () => {
	const { t } = useTranslation();
	return <div>{t("copyright-notice", { year: new Date().getFullYear(), company: t("fantasion-company-name") })}</div>;
};

export const Footer = () => {
	const { t } = useTranslation();
	return (
		<Container as="footer" className={styles.footer}>
			<Row>
				<Col md={9}>
					<div>
						<strong>{t("follow-us")}</strong>
						<SocialNetworks className={styles.social} subscribable={false} />
					</div>
					<div className={styles.footerInfo}>
						<FooterLinks />
						<CopyrightNotice />
					</div>
				</Col>
				<Col className="d-flex justify-content-end" md={3}>
					<SiteLogo className={styles.footerLogo} />
				</Col>
			</Row>
		</Container>
	);
};
