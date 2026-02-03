import type { ReactElement } from "react";
import { type DateInput, formatDateRange } from "./index";

export type DateRangeProps = {
	start: DateInput;
	end: DateInput;
	locale: string;
};

export const DateRange = ({ start, end, locale }: DateRangeProps): ReactElement => (
	<time dateTime={`${start}/${end}`}>{formatDateRange(locale, start, end)}</time>
);
