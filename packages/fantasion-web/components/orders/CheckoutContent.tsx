"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { reverse } from "../../routeMap";
import { InteractiveButton } from "../buttons";
import { useFetch } from "../context";
import { BillingInformationPreview, OrderCard } from "../orders";
import { OrderConfirmForm } from "../orders/OrderConfirmForm";
import type { Order } from "./types";

type OrderConfirmFormValues = {
	requestInsurance?: boolean;
	termsAndConditions: true;
};

type CheckoutContentProps = {
	initialOrder: Order;
};

export function CheckoutContent({ initialOrder }: CheckoutContentProps) {
	const [order, setOrder] = useState(initialOrder);
	const { t } = useTranslation();
	const fetch = useFetch();
	const title = `${t("order-checkout")}`;
	const router = useRouter();
	const lang = useLocale();

	const confirmOrder = async (body: OrderConfirmFormValues) => {
		const o = (await fetch.put(`/orders/${order.id}/confirm`, {
			body: body,
		})) as unknown as Order;
		setOrder(o);
		router.push(reverse(lang, "orderDetail", { orderId: String(o.id) }));
	};

	return (
		<Container as="article" className="mt-3">
			<Row>
				<Col lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
					<Breadcrumbs
						links={[
							{
								children: t("order-basket"),
								route: "basket",
							},
							{
								children: t("order-payment-and-delivery"),
								route: "paymentAndDelivery",
							},
							{
								children: t("order-checkout"),
							},
						]}
					/>
					<header>
						<Heading level={1}>{title}</Heading>
					</header>
					<OrderCard className="mt-4" order={order} hideStatus={true} />
					<BillingInformationPreview order={order} />
					<div className="d-flex justify-content-between mt-3 align-items-end">
						<Link as={InteractiveButton} size="lg" route="paymentAndDelivery" variant="secondary">
							{t("order-previous")}
						</Link>
						<div>
							<OrderConfirmForm onSubmit={confirmOrder} />
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
}
