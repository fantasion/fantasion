"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { useState } from "react";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { InteractiveButton } from "../buttons";
import { BillingInformation, OrderCard, PaymentInformation } from "../orders";
import type { Order } from "./types";

type AddressType = {
	id: number;
	title?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
	countryCode?: string;
	[key: string]: unknown;
};

type AddressList = {
	results: AddressType[];
};

type PaymentAndDeliveryContentProps = {
	initialOrder: Order;
	initialAddresses: AddressList;
};

export function PaymentAndDeliveryContent({ initialOrder, initialAddresses }: PaymentAndDeliveryContentProps) {
	const [order, setOrder] = useState<Order>(initialOrder);
	const [addresses, setAddresses] = useState<AddressList>(initialAddresses);
	const { t } = useTranslation();

	const handleAddAddress = (address: AddressType) => {
		setAddresses({
			...addresses,
			results: [...addresses.results, address],
		});
	};

	return (
		<Container as="article" className="mt-3">
			<Breadcrumbs
				links={[
					{
						children: t("order-basket"),
						route: "basket",
					},
					{
						children: t("order-payment-and-delivery"),
					},
				]}
			/>
			<header>
				<Heading level={1}>{t("order-payment-and-delivery")}</Heading>
			</header>
			<Row>
				<Col md={6}>
					<PaymentInformation order={order} onSubmit={setOrder} />
					<BillingInformation addresses={addresses} order={order} onSubmit={setOrder} onAddAddress={handleAddAddress} />
				</Col>
				<Col md={6}>
					<OrderCard className="mt-4" order={order} hideStatus={true} />
				</Col>
			</Row>
			<div className="d-flex justify-content-between mt-3">
				<Link as={InteractiveButton} size="lg" route="basket" variant="secondary">
					{t("order-previous")}
				</Link>
				<Link as={InteractiveButton} disabled={!order.userInvoiceAddressId} size="lg" route="checkout">
					{t("order-next")}
				</Link>
			</div>
		</Container>
	);
}
