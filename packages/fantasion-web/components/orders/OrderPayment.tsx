"use client";

import { Carousel, CarouselItem, Modal, ModalBody, ModalHeader, ModalTitle } from "@fantasion/ui";
import { useState } from "react";
import { ACCOUNT_BIC, ACCOUNT_IBAN, ACCOUNT_NUMBER, DEFAULT_CURRENCY } from "../../content/money/constants";
import { PaymentQrCode } from "../../content/money/PaymentQrCode";
import { useTranslation } from "../../lib/i18n-context";
import { InteractiveButton } from "../buttons";
import { useUser } from "../context";
import { OrderMoneyRow, OrderPaymentRow } from "../orders-ui";
import styles from "./OrderPayment.module.scss";
import { CAN_BE_PAID, ORDER_STATUS_DEPOSIT_PAID } from "./OrderStatus";
import type { Order } from "./types";

// Re-export for convenience
export { OrderMoneyRow, OrderPaymentRow } from "../orders-ui";

type OrderForPayment = Pick<Order, "price" | "deposit" | "variableSymbol" | "useDepositPayment" | "status"> & {
	[key: string]: unknown;
};

type PayAs = "deposit" | "surcharge" | "price" | null;

const OrderPayDialog = ({
	payAs,
	onHide,
	order,
	show,
}: {
	payAs: PayAs;
	onHide: () => void;
	order: OrderForPayment;
	show: boolean;
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { t } = useTranslation();
	const user = useUser();
	const markAsPaid = () => setActiveIndex(1);
	const getAmount = () => {
		if (payAs === "surcharge") {
			return (order.price ?? 0) - (order.deposit ?? 0);
		}
		if (payAs === "deposit") {
			return order.deposit ?? 0;
		}
		return order.price ?? 0;
	};
	const amount: number = getAmount();
	return (
		<Modal show={show} onHide={onHide} onExited={() => setActiveIndex(0)}>
			<ModalHeader closeButton={true}>
				<ModalTitle>{t("order-pay")}</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Carousel activeIndex={activeIndex} indicators={false} touch={false} wrap={false} controls={false}>
					<CarouselItem>
						<p>{t("order-send-payment")}</p>
						<div className="mt-3">
							<OrderPaymentRow
								align="text-start"
								className={styles.paymentRow}
								label={t("bank-account-number")}
								value={ACCOUNT_NUMBER}
								copyPasta={ACCOUNT_NUMBER}
							/>
							<OrderPaymentRow
								align="text-start"
								className={styles.paymentRow}
								label={t("order-variable-symbol")}
								value={order.variableSymbol}
								copyPasta={order.variableSymbol}
							/>
							<OrderMoneyRow
								align="text-start"
								className={styles.paymentRow}
								label={t("order-pay-amount")}
								amount={amount}
								copyPasta={String(amount)}
							/>
							<OrderPaymentRow
								align="text-start"
								className={styles.paymentRow}
								label={t("bank-account-iban")}
								value={ACCOUNT_IBAN}
								copyPasta={ACCOUNT_IBAN}
							/>
							<OrderPaymentRow
								align="text-start"
								className={styles.paymentRow}
								label={t("bank-account-bic")}
								value={ACCOUNT_BIC}
								copyPasta={ACCOUNT_BIC}
							/>
						</div>
						<hr />
						<div className="d-flex justify-content-center">
							<PaymentQrCode
								amount={Number(amount)}
								bic={ACCOUNT_BIC}
								currency={DEFAULT_CURRENCY}
								message={user?.email ?? ""}
								iban={ACCOUNT_IBAN}
								variableSymbol={order.variableSymbol ?? ""}
							/>
						</div>
						<hr />
						<div className="d-flex justify-content-center">
							<InteractiveButton variant="primary" onClick={markAsPaid}>
								{t("order-already-paid")}
							</InteractiveButton>
						</div>
					</CarouselItem>
					<CarouselItem>
						<p className="fs-3">{t("that-is-great")}</p>
						<p>{t("order-wait-after-payment")}</p>
						<div className="mt-3">
							<InteractiveButton variant="primary" onClick={onHide}>
								{t("that-is-really-awesome")}
							</InteractiveButton>
						</div>
					</CarouselItem>
				</Carousel>
			</ModalBody>
		</Modal>
	);
};

const OrderPaymentButtons = ({ order }: { order: OrderForPayment }) => {
	const [payAs, setPayAs] = useState<PayAs>(null);
	const [showDialog, setShowDialog] = useState(false);
	const { t } = useTranslation();
	const closeDialog = () => setShowDialog(false);
	const payDeposit = () => {
		setPayAs("deposit");
		setShowDialog(true);
	};
	const paySurcharge = () => {
		setPayAs("surcharge");
		setShowDialog(true);
	};
	const payFull = () => {
		setPayAs("price");
		setShowDialog(true);
	};
	return (
		<>
			<OrderPayDialog onHide={closeDialog} order={order} payAs={payAs} show={showDialog} />
			{order.useDepositPayment && order.status !== ORDER_STATUS_DEPOSIT_PAID && (
				<InteractiveButton variant="primary" onClick={payDeposit} className="m-2">
					{t("order-pay-deposit")}
				</InteractiveButton>
			)}
			{order.status === ORDER_STATUS_DEPOSIT_PAID && (
				<InteractiveButton variant="primary" onClick={paySurcharge} className="m-2">
					{t("order-pay-surcharge")}
				</InteractiveButton>
			)}
			{order.status !== ORDER_STATUS_DEPOSIT_PAID && (
				<InteractiveButton
					className="m-2"
					variant={order.useDepositPayment ? "secondary" : "primary"}
					onClick={payFull}
				>
					{t("order-pay-full")}
				</InteractiveButton>
			)}
		</>
	);
};

export const OrderPaymentControls = ({ order, ...props }: { order: OrderForPayment; [key: string]: unknown }) =>
	order.status != null && CAN_BE_PAID.includes(order.status) && <OrderPaymentButtons order={order} {...props} />;
