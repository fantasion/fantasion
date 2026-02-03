import type React from "react";
import { formatMoney, type MoneyAmount } from "./index.js";

export type MoneyProps = React.HTMLAttributes<HTMLSpanElement> & {
	amount: MoneyAmount;
	currency: string;
	locale: string;
};

export const Money = ({ amount, currency, locale, ...props }: MoneyProps) => (
	<span {...props}>{formatMoney(locale, amount, currency)}</span>
);
