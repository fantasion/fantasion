import { type DateInput, DateTimeLabel as UiDateTimeLabel } from "@fantasion/ui";
import type { ReactElement } from "react";
import { useTranslation } from "../lib/i18n-context";

type DateFormatOptions = Intl.DateTimeFormatOptions;

type DateTimeLabelProps = DateFormatOptions & {
	date: DateInput;
};

export const DateTimeLabel = ({ date, ...props }: DateTimeLabelProps): ReactElement => {
	const { i18n } = useTranslation();
	return <UiDateTimeLabel date={date} locale={i18n.language} {...props} />;
};
