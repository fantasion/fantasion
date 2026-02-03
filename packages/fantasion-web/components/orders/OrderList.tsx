"use client";

import { Col, ListGroupItem, Row } from "@fantasion/ui";
import { Section } from "../../content/content";
import { Link } from "../../content/links";
import { Money } from "../../content/money/Money";
import { DateLabel } from "../../datetime/DateLabel";
import { useTranslation } from "../../lib/i18n-context";
import { OrderItemIcons } from "./OrderItem";
import { ORDER_STATUS_NEW, type OrderStatus, OrderStatusLabel } from "./OrderStatus";
import type { Order, OrdersResult } from "./types";

/* OrdersResult is now defined in ./types/orders */

type OrderListRowProps = {
	order: Order;
	[key: string]: unknown;
};

type OrderListProps = {
	orders: OrdersResult;
	onOrderCancel?: (order: Order) => undefined | Promise<unknown>;
};

const OrderListRow = ({ order, ...props }: OrderListRowProps) => (
	<ListGroupItem {...props}>
		<Row>
			<Col xs={6} sm={8} md={10}>
				<Row>
					<Col sm={6} md={4}>
						<Row>
							<Col xs={12} lg={6}>
								<Link route="orderDetail" params={{ orderId: String(order.id) }}>
									<strong>{order.variableSymbol}</strong>
								</Link>
							</Col>
							<Col xs={12} lg={6}>
								{order.submittedAt ? <DateLabel date={order.submittedAt} /> : null}
							</Col>
						</Row>
					</Col>
					<Col sm={6} md={8}>
						<Row>
							<Col xs={12} lg={6}>
								<Money amount={order.price ?? 0} />
							</Col>
							<Col xs={12} lg={6}>
								<OrderStatusLabel status={(order.status ?? ORDER_STATUS_NEW) as OrderStatus} />
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
			<Col xs={6} sm={4} md={2} className="d-flex justify-content-end">
				<OrderItemIcons items={order.items || []} />
			</Col>
		</Row>
	</ListGroupItem>
);

const OrderListEmpty = () => (
	<div className="mt-3 text-muted">
		<p>{useTranslation().t("order-list-empty")}</p>
	</div>
);

export const OrderList = ({ orders, onOrderCancel }: OrderListProps) => (
	<Section className="mt-3">
		{orders.results.length === 0 ? (
			<OrderListEmpty />
		) : (
			orders.results.map((order: Order) => <OrderListRow key={order.id} order={order} onCancel={onOrderCancel} />)
		)}
	</Section>
);
