import { type DateInput, DateRange as UiDateRange } from "@fantasion/ui";
import type { ReactElement } from "react";
import { useTranslation } from "../lib/i18n-context";

type DateRangeProps = {
	start: DateInput;
	end: DateInput;
};

export const DateRange = ({ start, end }: DateRangeProps): ReactElement => {
	const { i18n } = useTranslation();
	return <UiDateRange start={start} end={end} locale={i18n.language} />;
};
