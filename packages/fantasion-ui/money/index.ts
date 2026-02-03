// Money domain components

export type { MoneyProps } from "./Money.js";
export { Money } from "./Money.js";
export type { PriceLabelProps } from "./PriceLabel.js";
export { PriceLabel } from "./PriceLabel.js";

// Money types and formatters
export type MoneyAmount = number | string;

export const formatMoney = (locale: string, amount: MoneyAmount, currency: string): string =>
	new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(Number.parseFloat(String(amount)));
