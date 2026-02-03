import type { ComponentType, ReactNode } from "react";
import { IconLabel } from "../content/IconLabel.js";

export type PriceLabelProps = {
	priceIcon: ComponentType;
	priceText: ReactNode;
};

export const PriceLabel = ({ priceIcon, priceText }: PriceLabelProps) => (
	<IconLabel icon={priceIcon} text={priceText} />
);
