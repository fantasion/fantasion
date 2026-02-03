import { type MoneyAmount, Money as UiMoney } from "@fantasion/ui";
import { useTranslation } from "@/lib/i18n-context";
import { DEFAULT_CURRENCY } from "./constants";

type MoneyProps = React.HTMLAttributes<HTMLSpanElement> & {
	amount: MoneyAmount;
	currency?: string;
};

export const Money = ({ amount, currency = DEFAULT_CURRENCY, ...props }: MoneyProps) => {
	const { i18n } = useTranslation();
	return <UiMoney amount={amount} currency={currency} locale={i18n.language} {...props} />;
};
