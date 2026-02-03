"use client";

import {
	type OrderStatus,
	OrderStatusMap,
	EmptyBasket as UIEmptyBasket,
	OrderMoneyRow as UIOrderMoneyRow,
	OrderPaymentRow as UIOrderPaymentRow,
	OrderStatusLabel as UIOrderStatusLabel,
} from "@fantasion/ui";
import type React from "react";
import { CheckIcon } from "../content/icons";
import { Money } from "../content/money/Money";
import { useTranslation } from "../lib/i18n-context";

// Re-export constants
export {
	CAN_BE_PAID,
	ORDER_STATUS_CANCELLED,
	ORDER_STATUS_CONFIRMED,
	ORDER_STATUS_DEPOSIT_PAID,
	ORDER_STATUS_DISPATCHED,
	ORDER_STATUS_NEW,
	ORDER_STATUS_PAID,
	ORDER_STATUS_RESOLVED,
} from "@fantasion/ui";

// Wrapper with i18n
export const OrderStatusLabel = ({ status }: { status: OrderStatus }) => {
	const { t } = useTranslation();
	return <UIOrderStatusLabel status={status} label={t(OrderStatusMap[status])} />;
};

// Wrapper with copy icon and label
type OrderPaymentRowWrapperProps = {
	align?: string;
	className?: string;
	copyPasta?: string;
	label: string;
	value: React.ReactNode;
	[key: string]: unknown;
};

export const OrderPaymentRow = (props: OrderPaymentRowWrapperProps) => {
	const { t } = useTranslation();
	return <UIOrderPaymentRow {...props} copyIcon={CheckIcon} copiedLabel={t("copied")} />;
};

// Wrapper with Money formatter
type OrderMoneyRowWrapperProps = {
	amount: number;
	label: string;
	align?: string;
	className?: string;
	copyPasta?: string;
	[key: string]: unknown;
};

export const OrderMoneyRow = (props: OrderMoneyRowWrapperProps) => {
	const { t } = useTranslation();
	return (
		<UIOrderMoneyRow
			{...props}
			moneyFormatter={(amount) => <Money amount={amount} />}
			copyIcon={CheckIcon}
			copiedLabel={t("copied")}
		/>
	);
};

// Wrapper with i18n
export const EmptyBasket = (props: { [key: string]: unknown }) => {
	const { t } = useTranslation();
	return <UIEmptyBasket {...props} message={t("order-basket-empty")} />;
};
