import { PriceLabel as UiPriceLabel } from "@fantasion/ui";
import { PriceIcon } from "../icons";
import { Money } from "./Money";
import type { MoneyAmount } from "./types";

type PriceLabelProps = {
	price: MoneyAmount;
};

export const PriceLabel = ({ price }: PriceLabelProps) => (
	<UiPriceLabel priceIcon={PriceIcon} priceText={<Money amount={price} />} />
);
