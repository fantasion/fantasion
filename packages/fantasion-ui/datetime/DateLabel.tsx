import type { ReactElement } from "react";
import { type DateInput, formatDate } from "./index";

type DateFormatOptions = Intl.DateTimeFormatOptions;

export type DateLabelProps = DateFormatOptions & {
	date: DateInput;
	locale: string;
};

export const DateLabel = ({ date, locale, ...props }: DateLabelProps): ReactElement => (
	<time dateTime={`${date}`}>{formatDate(locale, date, props)}</time>
);
