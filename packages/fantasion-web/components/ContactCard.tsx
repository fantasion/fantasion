"use client";

import { ContactInfoCard } from "@fantasion/ui";
import { ACCOUNT_BANK, ACCOUNT_BIC, ACCOUNT_IBAN, ACCOUNT_NUMBER } from "@/content/money/constants";
import { useTranslation } from "../lib/i18n-context";

const CONTACT_TEL = "+420 703 629 310";
const CONTACT_EMAIL = "info@fantasion.cz";
const CONTACT_IN = "14166658";

export const ContactCard = () => {
	const { t } = useTranslation();

	return (
		<ContactInfoCard
			contactItems={[
				{ label: t("contact-email"), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
				{ label: t("contact-phone"), value: CONTACT_TEL, href: `tel:${CONTACT_TEL}` },
				{ label: t("contact-in"), value: CONTACT_IN },
			]}
			address={{
				street: "Blažíčkova",
				streetNumber: "984/20",
				city: "Praha 4 Krč",
				postalCode: "140 00",
			}}
			addressLabel={t("contact-address")}
			bankAccount={{
				accountNumber: ACCOUNT_NUMBER,
				bankName: ACCOUNT_BANK,
				iban: ACCOUNT_IBAN,
				bic: ACCOUNT_BIC,
			}}
			bankLabels={{
				sectionTitle: t("bank-connection"),
				accountNumber: t("bank-account-number"),
				bankName: t("bank-account-bank"),
				iban: t("bank-account-iban"),
				bic: t("bank-account-bic"),
			}}
		/>
	);
};
