import type { ReactNode } from "react";
import { Card, CardBody } from "../../Card/index.js";
import { ListGroup, ListGroupItem } from "../../lists/index.js";
import { Address, type AddressProps } from "../../location/index.js";
import styles from "./ContactInfoCard.module.scss";

export type ContactInfoItem = {
	/** Label for the contact item (e.g., "Email", "Phone") */
	label: string;
	/** Value to display */
	value: string;
	/** Optional href for making it a link (e.g., "mailto:..." or "tel:...") */
	href?: string;
};

export type BankAccountInfo = {
	/** Account number */
	accountNumber?: string;
	/** Bank name */
	bankName?: string;
	/** IBAN */
	iban?: string;
	/** BIC/SWIFT code */
	bic?: string;
};

export type ContactInfoCardProps = {
	/** Contact information items (email, phone, etc.) */
	contactItems?: ContactInfoItem[];
	/** Address information */
	address?: AddressProps;
	/** Label for the address section */
	addressLabel?: string;
	/** Bank account information */
	bankAccount?: BankAccountInfo;
	/** Labels for bank account fields */
	bankLabels?: {
		sectionTitle?: string;
		accountNumber?: string;
		bankName?: string;
		iban?: string;
		bic?: string;
	};
	/** Separator between label and value */
	separator?: string;
	/** Additional class name */
	className?: string;
};

const ContactItem = ({ label, value, href, separator }: ContactInfoItem & { separator: string }) => (
	<ListGroupItem>
		{label}
		{separator}
		{href ? <a href={href}>{value}</a> : value}
	</ListGroupItem>
);

const Section = ({ title, children }: { title?: string; children: ReactNode }) => (
	<div className={styles.section}>
		{title && <h3 className={styles.sectionTitle}>{title}</h3>}
		{children}
	</div>
);

/**
 * ContactInfoCard - Displays contact information in a card layout.
 *
 * @example
 * ```tsx
 * <ContactInfoCard
 *   contactItems={[
 *     { label: "Email", value: "info@example.com", href: "mailto:info@example.com" },
 *     { label: "Phone", value: "+1 234 567 890", href: "tel:+1234567890" },
 *   ]}
 *   address={{ street: "Main St", streetNumber: "123", city: "Springfield", postalCode: "12345" }}
 *   addressLabel="Our Address"
 * />
 * ```
 */
export const ContactInfoCard = ({
	contactItems = [],
	address,
	addressLabel,
	bankAccount,
	bankLabels = {},
	separator = ": ",
	className,
}: ContactInfoCardProps) => {
	const hasBankInfo = bankAccount && (bankAccount.accountNumber || bankAccount.iban);

	return (
		<div className={className}>
			{contactItems.length > 0 && (
				<Card className={styles.card}>
					<ListGroup flush={true}>
						{contactItems.map((item) => (
							<ContactItem key={item.label} {...item} separator={separator} />
						))}
					</ListGroup>
				</Card>
			)}

			{address && (
				<Section title={addressLabel}>
					<Card className={styles.card}>
						<CardBody>
							<Address {...address} />
						</CardBody>
					</Card>
				</Section>
			)}

			{hasBankInfo && (
				<Section title={bankLabels.sectionTitle}>
					<Card className={styles.card}>
						<ListGroup flush={true}>
							{bankAccount.accountNumber && (
								<ListGroupItem>
									{bankLabels.accountNumber || "Account"}
									{separator}
									{bankAccount.accountNumber}
								</ListGroupItem>
							)}
							{bankAccount.bankName && (
								<ListGroupItem>
									{bankLabels.bankName || "Bank"}
									{separator}
									{bankAccount.bankName}
								</ListGroupItem>
							)}
							{bankAccount.iban && (
								<ListGroupItem>
									{bankLabels.iban || "IBAN"}
									{separator}
									{bankAccount.iban}
								</ListGroupItem>
							)}
							{bankAccount.bic && (
								<ListGroupItem>
									{bankLabels.bic || "BIC"}
									{separator}
									{bankAccount.bic}
								</ListGroupItem>
							)}
						</ListGroup>
					</Card>
				</Section>
			)}
		</div>
	);
};

ContactInfoCard.displayName = "ContactInfoCard";
