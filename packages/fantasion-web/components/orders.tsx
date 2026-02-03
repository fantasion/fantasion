"use client";

import { Alert, Col, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, ModalTitle, Row } from "@fantasion/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useFormContext } from "react-hook-form";
import countryList from "react-select-country-list";
import { z } from "zod";
import { Address, PostalCodeInput, StreetNumberInput } from "../content/addresses";
import { Heading, Section } from "../content/content";
import { CancelIcon } from "../content/icons";
import { Money } from "../content/money/Money";
import { AutosaveForm } from "../forms/AutosaveForm";
import { Form } from "../forms/Form";
import { FormControls } from "../forms/FormControls";
import { Input } from "../forms/Input";
import { useTranslation } from "../lib/i18n-context";
import { InteractiveButton } from "./buttons";
import { useFetch, useUser } from "./context";
import { OrderItemDescription } from "./orders/OrderItem";
import { OrderMoneyRow, OrderPaymentControls, OrderPaymentRow } from "./orders/OrderPayment";
import { ORDER_STATUS_NEW, OrderStatusLabel } from "./orders/OrderStatus";
import type { Order, OrderItemType } from "./orders/types";
import { UserName } from "./users";

/* OrderItemType is now defined in ./types/orders */

/* Order is now defined in ./types/orders */

const COL_FULL_WIDTH = 12;
const COL_HALF_WIDTH = 6;

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

type OrderCancelResult = Order;

const OrderItem = ({ item, onDelete }: { item: OrderItemType; onDelete?: (item: OrderItemType) => void }) => (
	<div className="d-flex">
		<ListGroupItem className="d-flex flex-fill">
			<div className="flex-grow-1">
				<OrderItemDescription item={item} />
			</div>
			<div className="text-end">
				<Money amount={item.price ?? 0} />
			</div>
		</ListGroupItem>
		{onDelete && <InteractiveButton icon={CancelIcon} onClick={() => onDelete(item)} variant="danger" />}
	</div>
);

const OrderItems = ({ items, onDelete }: { items: OrderItemType[]; onDelete?: (item: OrderItemType) => void }) => (
	<ListGroup className="mt-2">
		{items.map((item: OrderItemType) => (
			<OrderItem item={item} key={item.id} onDelete={onDelete} />
		))}
	</ListGroup>
);

type OrderCancelDialogProps = {
	error: React.ReactNode | null;
	inProgress: boolean;
	onCancel: () => Promise<void>;
	onHide: () => void;
	show: boolean;
};

const OrderCancelDialog = ({ error, inProgress, onCancel, onHide, show }: OrderCancelDialogProps) => {
	const { t } = useTranslation();
	return (
		<Modal show={show} onHide={inProgress ? undefined : onHide}>
			<ModalHeader closeButton={!inProgress}>
				<ModalTitle>{t("order-cancel")}</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<p>{t("order-cancel-cannot-go-back")}</p>
				<p className="mt-2">{t("order-will-be-refunded")}</p>
				{error && (
					<div className="mt-3">
						<Alert variant="danger">{error ?? t("operation-failed")}</Alert>
					</div>
				)}
				<div className="mt-3">
					<InteractiveButton inProgress={inProgress} onClick={onCancel} variant="danger">
						{t("order-cancel")}
					</InteractiveButton>
				</div>
			</ModalBody>
		</Modal>
	);
};

const OrderCancel = ({ order, onCancel }: { order: Order; onCancel?: (order: Order) => void }) => {
	const { t } = useTranslation();
	const [inProgress, setInProgress] = useState(false);
	const [error, setError] = useState<React.ReactNode | null>(null);
	const [show, setShow] = useState(false);
	const fetch = useFetch();

	const handleCancel = async () => {
		setError(null);
		setInProgress(true);
		try {
			const updated = (await fetch.put(`/orders/${order.id}/cancel`)) as unknown as OrderCancelResult;
			onCancel?.(updated);
			setShow(false);
		} catch (e) {
			setError((e as Error)?.message ?? String(e));
		} finally {
			setInProgress(false);
		}
	};

	return (
		order.isCancellable && (
			<>
				<OrderCancelDialog
					error={error}
					inProgress={inProgress}
					onCancel={handleCancel}
					onHide={() => setShow(false)}
					show={show}
				/>
				<InteractiveButton icon={CancelIcon} onClick={() => setShow(true)} title={t("order-cancel")} variant="link" />
			</>
		)
	);
};

export const OrderCard = ({
	order,
	hideStatus,
	onCancel,
	onItemDelete,
	...props
}: {
	order: Order;
	hideStatus?: boolean;
	onCancel?: (order: Order) => void;
	onItemDelete?: (item: OrderItemType) => void;
	[key: string]: unknown;
}) => {
	const { t } = useTranslation();
	return (
		<Section component="article" {...(props as Record<string, unknown>)}>
			{!hideStatus && (
				<header className="d-flex justify-content-between align-items-start">
					<Heading level={2}>{order.variableSymbol}</Heading>
					{order.isCancellable && onCancel && <OrderCancel order={order} onCancel={onCancel} />}
				</header>
			)}
			<OrderItems items={order?.items || []} onDelete={onItemDelete} />
			<Row className="flex-column-reverse flex-md-row">
				<Col md={hideStatus ? COL_FULL_WIDTH : COL_HALF_WIDTH} className="mt-1">
					<div className="d-flex justify-content-center justify-content-md-start flex-md-row flex-row-reverse">
						<OrderPaymentControls order={order} />
					</div>
				</Col>
				<Col md={hideStatus ? COL_FULL_WIDTH : COL_HALF_WIDTH} className="d-flex mt-2">
					<div className="ms-auto me-3">
						{order.useDepositPayment && (
							<>
								<OrderMoneyRow label={t("order-deposit")} amount={order.deposit ?? 0} />
								<OrderMoneyRow label={t("order-surcharge")} amount={(order.price ?? 0) - (order.deposit ?? 0)} />
							</>
						)}
						<OrderMoneyRow label={t("order-total")} amount={order.price ?? 0} />
						{!hideStatus && (
							<OrderPaymentRow
								className=""
								copyPasta={undefined}
								label={t("order-status")}
								value={<OrderStatusLabel status={order.status ?? ORDER_STATUS_NEW} />}
							/>
						)}
					</div>
				</Col>
			</Row>
		</Section>
	);
};

export const PromotionCodeForm = ({ order, onSubmit }: { order: Order; onSubmit: (order: Order) => void }) => {
	const fetch = useFetch();
	const { t } = useTranslation();
	const handleSubmit = async (body: { code: string }) => {
		const updated = (await fetch.post(`/orders/${order.id}/promotion-codes`, {
			body: body,
		})) as unknown as Order;
		onSubmit(updated);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input name="code" type="text" label={t("order-promotion-code")} required={true} />
			<FormControls submitLabel={t("order-add-promotion-code")} />
		</Form>
	);
};

type AddressFormValues = {
	title: string;
	street: string;
	streetNumber?: string;
	countryCode: string;
	city: string;
	postalCode?: string;
};

const AddressForm = ({ onSubmit }: { onSubmit: (values: AddressFormValues) => undefined | Promise<unknown> }) => {
	const { t } = useTranslation();
	const formId = useId();
	const defaultValues: Pick<AddressFormValues, "title" | "countryCode"> = {
		title: t("user-address-title-home"),
		countryCode: "CZ",
	};
	const schema = z.object({
		title: z.string().min(1, t("form-input-required")),
		street: z.string().min(1, t("form-input-required")),
		countryCode: z.string().min(1, t("form-input-required")),
		city: z.string().min(1, t("form-input-required")),
	});
	const countries = countryList().getData();
	return (
		<Form<AddressFormValues>
			id={formId}
			onSubmit={onSubmit}
			defaultValues={defaultValues}
			resolver={zodResolver(schema)}
		>
			<Input name="title" label={t("address-title")} required={true} />
			<Row>
				<Col sm="auto">
					<Input name="street" label={t("address-street")} required={true} />
				</Col>
				<Col sm="auto">
					<StreetNumberInput name="streetNumber" label={t("address-street-number")} required={true} />
				</Col>
			</Row>
			<Row>
				<Input name="countryCode" type="select" options={countries} label={t("address-country")} required={true} />
				<Col sm="auto">
					<Input name="city" label={t("address-city")} required={true} />
				</Col>
				<Col sm="auto">
					<PostalCodeInput name="postalCode" label={t("address-postal-code")} required={true} />
				</Col>
			</Row>
			<FormControls submitLabel={t("address-save")} />
		</Form>
	);
};

const AddAddressDialog = ({
	show,
	onHide,
	onSubmit,
}: {
	show: boolean;
	onHide: () => void;
	onSubmit: (values: AddressFormValues) => undefined | Promise<unknown>;
}) => {
	const { t } = useTranslation();
	return (
		<Modal show={show}>
			<ModalHeader closeButton={true} onHide={onHide}>
				<ModalTitle>{t("address-add")}</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<AddressForm onSubmit={onSubmit} />
			</ModalBody>
		</Modal>
	);
};

export const BillingInformationPreview = ({ order }: { order: Order }) => {
	const { t } = useTranslation();
	const user = useUser();
	return (
		<Section className="mt-3">
			<Heading level={2}>{t("order-billing-information")}</Heading>
			<p>
				<UserName user={user} />{" "}
			</p>
			<Address {...order.userInvoiceAddress} />
			<Heading level={2} className="mt-3">
				{t("order-payment-information")}
			</Heading>
			<p>{t("order-pay-via-bank-transfer-only")}</p>
		</Section>
	);
};

export const BillingInformation = ({
	addresses,
	onAddAddress,
	onSubmit,
	order,
}: {
	addresses: AddressList;
	onAddAddress: (addr: AddressType) => void;
	onSubmit: (order: Order) => void;
	order: Order;
}) => {
	const [showDialog, setShowDialog] = useState(false);
	const { t } = useTranslation();
	const fetch = useFetch();
	const defaultValues = {
		addressId: String(order.userInvoiceAddressId ?? addresses.results[0]?.id ?? ""),
	};
	const selectAddress = async (values: { addressId: string }) => {
		const updated = (await fetch.patch(`/orders/${order.id}`, {
			body: {
				userInvoiceAddressId: Number.parseInt(values.addressId, 10),
			},
		})) as unknown as Order;
		onSubmit(updated);
	};
	const showAddAddressDialog = () => setShowDialog(true);
	const hideAddAddressDialog = () => setShowDialog(false);
	const createAddress = async (values: AddressFormValues) => {
		const addr = (await fetch.post("/user-addresses", {
			body: values,
		})) as unknown as AddressType;
		await fetch.patch(`/orders/${order.id}`, {
			userInvoiceAddressId: addr.id,
		});
		onAddAddress(addr);
		hideAddAddressDialog();
	};

	return (
		<Section className="mt-3">
			<Heading level={2}>{t("order-billing-information")}</Heading>
			<AddAddressDialog show={showDialog} onHide={hideAddAddressDialog} onSubmit={createAddress} />
			<AutosaveForm<{ addressId: string }> defaultValues={defaultValues} onSubmit={selectAddress}>
				{addresses.results.map((address: AddressType) => (
					<Input
						type="radio"
						name="addressId"
						key={address.id}
						label={<Address {...address} />}
						value={String(address.id)}
					/>
				))}
				<InteractiveButton variant="link" onClick={showAddAddressDialog}>
					{t("address-add")}
				</InteractiveButton>
			</AutosaveForm>
		</Section>
	);
};

const DepositSplitInput = () => {
	const { t } = useTranslation();
	const { watch } = useFormContext();
	const split = watch("useDepositPayment");
	return (
		<Input
			helpText={t(split ? "order-deposit-help-text" : "order-full-payment-help-text")}
			label={t("order-use-deposit-payment")}
			name="useDepositPayment"
			type="checkbox"
		/>
	);
};

export const PaymentInformation = ({ order, onSubmit }: { order: Order; onSubmit: (order: Order) => void }) => {
	const { t } = useTranslation();
	const fetch = useFetch();
	const defaultValues = {
		useDepositPayment: order.useDepositPayment,
	};
	const selectPaymentMethod = async (values: { useDepositPayment: boolean }) => {
		const updated = (await fetch.patch(`/orders/${order.id}`, {
			body: {
				useDepositPayment: values.useDepositPayment,
			},
		})) as unknown as Order;
		onSubmit(updated);
	};
	return (
		<Section className="mt-3">
			<Heading level={2}>{t("order-payment-information")}</Heading>
			<AutosaveForm<{ useDepositPayment: boolean }> defaultValues={defaultValues} onSubmit={selectPaymentMethod}>
				<p>{t("order-pay-via-bank-transfer-only")}</p>

				<DepositSplitInput />
			</AutosaveForm>
		</Section>
	);
};

// Re-export from UI wrapper
export { EmptyBasket } from "./orders-ui";
