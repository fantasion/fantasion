"use client";

import { useState } from "react";
import { Heading } from "../../content/content";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { ProfileLayout } from "../family/ProfileLayout";
import { OrderCard } from "../orders";
import type { Order } from "./types";

type OrderDetailContentProps = {
	initialOrder: Order;
};

export function OrderDetailContent({ initialOrder }: OrderDetailContentProps) {
	const [order] = useState(initialOrder);
	const { t } = useTranslation();
	const title = t("order-id-title", { orderNumber: order.variableSymbol ?? "" });

	return (
		<ProfileLayout>
			<Breadcrumbs
				links={[
					{
						children: t("my-status"),
						route: "status",
					},
					{
						children: title,
					},
				]}
			/>
			<header>
				<Heading level={1}>{title}</Heading>
			</header>
			<OrderCard order={order} />
		</ProfileLayout>
	);
}
