import type { ReactElement } from "react";
import { DateLabel } from "./DateLabel";
import type { DateInput } from "./index";

type DateFormatOptions = Intl.DateTimeFormatOptions;

export type DateTimeLabelProps = DateFormatOptions & {
	date: DateInput;
	locale: string;
};

export const DateTimeLabel = (props: DateTimeLabelProps): ReactElement => (
	<DateLabel hour="numeric" minute="numeric" {...props} />
);
