"use client";

import { useState } from "react";
import { Heading } from "../../content/content";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { ProfileLayout } from "../family/ProfileLayout";
import { OrderList } from "../orders/OrderList";
import type { Order, OrdersResult } from "../orders/types";

type StatusContentProps = {
	initialOrders: OrdersResult;
};

export function StatusContent({ initialOrders }: StatusContentProps) {
	const [orders, setOrders] = useState<OrdersResult>(initialOrders);
	const { t } = useTranslation();

	const onOrderCancel = (order: Order): undefined => {
		setOrders({
			...orders,
			results: orders.results.map((o: Order) => (o.id === order.id ? order : o)),
		});
	};

	return (
		<ProfileLayout>
			<Breadcrumbs
				links={[
					{
						children: t("my-status"),
					},
				]}
			/>
			<Heading level={1}>{t("orders")}</Heading>
			<OrderList orders={orders} onOrderCancel={onOrderCancel} />
		</ProfileLayout>
	);
}
