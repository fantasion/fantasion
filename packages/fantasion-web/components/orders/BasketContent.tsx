"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { Heading } from "../../content/content";
import { Link } from "../../content/links";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { InteractiveButton } from "../buttons";
import { useActiveOrder, useFetch, useSetActiveOrder } from "../context";
import { EmptyBasket, OrderCard, PromotionCodeForm } from "../orders";
import type { Order } from "./types";
import { PRODUCT_PROMOTION_CODE } from "./types";

export function BasketContent() {
	const order = useActiveOrder() as Order | null;
	const setOrder = useSetActiveOrder();
	const fetch = useFetch();
	const { t } = useTranslation();

	const deleteItem = async (item: { id: number }) => {
		setOrder((await fetch.delete(`/order-items/${item.id}`)) as unknown as Order);
	};

	const hasPromotionCode = Boolean(order?.items?.some((item) => item.productType === PRODUCT_PROMOTION_CODE));

	return (
		<Container as="article" className="mt-3">
			<Row>
				<Col lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
					<Breadcrumbs
						links={[
							{
								children: t("order-basket"),
							},
						]}
					/>
					<header>
						<Heading level={1}>{t("order-basket")}</Heading>
					</header>
					{(order?.items?.length ?? 0) ? (
						<>
							{/* biome-ignore lint/style/noNonNullAssertion: Guaranteed by conditional above */}
							<OrderCard className="mt-4" order={order!} hideStatus={true} onItemDelete={deleteItem} />
							<div className="d-flex justify-content-end mt-3">
								<Link as={InteractiveButton} size="lg" route="paymentAndDelivery">
									{t("order-next")}
								</Link>
							</div>
							{!hasPromotionCode && (
								<>
									{/* biome-ignore lint/style/noNonNullAssertion: Guaranteed by conditional above */}
									<PromotionCodeForm order={order!} onSubmit={setOrder} />
								</>
							)}
						</>
					) : (
						<EmptyBasket className="mt-4" />
					)}
				</Col>
			</Row>
		</Container>
	);
}
