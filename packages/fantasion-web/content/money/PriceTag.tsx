import classnames from "classnames";
import { DateLabel } from "@/datetime/DateLabel";
import { useTranslation } from "@/lib/i18n-context";
import styles from "../money.module.scss";
import { Money } from "./Money";
import type { MoneyAmount } from "./types";

type PriceTagDateProps = {
	direction: string;
	date?: string | null;
};

type PriceTagProps = {
	active: boolean;
	availableSince?: string | null;
	availableUntil?: string | null;
	expired?: boolean;
	future?: boolean;
	price: MoneyAmount;
};

const PriceTagDate = ({ direction, date }: PriceTagDateProps) => {
	if (!date) {
		return null;
	}
	const closingParen = ")";
	return (
		<span>
			{` (${direction} `}
			<span className="text-muted">
				<DateLabel date={date} />
			</span>
			{closingParen}
		</span>
	);
};

export const PriceTag = ({
	active,
	availableSince,
	availableUntil,
	expired = false,
	future = false,
	price,
}: PriceTagProps) => {
	const { t } = useTranslation();
	return (
		<span
			className={classnames({
				[styles.expired]: expired,
			})}
		>
			<Money
				amount={price}
				className={classnames({
					[styles.active]: active,
					[styles.future]: future,
				})}
			/>
			{future && <PriceTagDate direction={t("since")} date={availableSince || undefined} />}
			{(active || expired) && <PriceTagDate direction={t("until")} date={availableUntil || undefined} />}
		</span>
	);
};
