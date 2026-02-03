import { type DateInput, DateLabel as UiDateLabel } from "@fantasion/ui";
import type { ReactElement } from "react";
import { useTranslation } from "../lib/i18n-context";

type DateFormatOptions = Intl.DateTimeFormatOptions;

type DateLabelProps = DateFormatOptions & {
	date: DateInput;
};

export const DateLabel = ({ date, ...props }: DateLabelProps): ReactElement => {
	const { i18n } = useTranslation();
	return <UiDateLabel date={date} locale={i18n.language} {...props} />;
};
