import clsx from "clsx";
import type React from "react";
import type { ComponentType } from "react";
import { CopyButton } from "../buttons/CopyButton";
import styles from "./OrderPayment.module.scss";

export type OrderPaymentRowProps = {
	align?: string;
	className?: string;
	copyPasta?: string;
	copyIcon?: ComponentType;
	copiedLabel?: string;
	label: string;
	value: React.ReactNode;
	[key: string]: unknown;
};

export type OrderMoneyRowProps = {
	amount: number;
	label: string;
	moneyFormatter: (amount: number) => React.ReactNode;
	copyIcon?: ComponentType;
	copiedLabel?: string;
	[key: string]: unknown;
};

export const OrderPaymentRow = ({
	align = "text-end",
	className,
	copyPasta,
	copyIcon,
	copiedLabel,
	label,
	value,
	...props
}: OrderPaymentRowProps) => (
	<div {...props} className={clsx(align, className)}>
		<span className={styles.orderRowLabel}>{`${label}:`}</span>{" "}
		<span
			className={clsx(styles.orderRowValue, {
				[styles.copyPasta]: copyPasta,
			})}
		>
			{value}
			{copyPasta && copyIcon && copiedLabel && (
				<CopyButton value={copyPasta} copyIcon={copyIcon} copiedLabel={copiedLabel} />
			)}
		</span>
	</div>
);

export const OrderMoneyRow = ({
	amount,
	label,
	moneyFormatter,
	copyIcon,
	copiedLabel,
	...props
}: OrderMoneyRowProps) => (
	<OrderPaymentRow
		{...props}
		label={label}
		value={moneyFormatter(amount)}
		copyIcon={copyIcon}
		copiedLabel={copiedLabel}
	/>
);
