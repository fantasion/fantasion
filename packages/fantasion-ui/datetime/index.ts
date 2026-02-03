// DateTime domain components
export * from "./DateLabel.js";
export * from "./DateRange.js";
export * from "./DateTimeLabel.js";

// DateTime types and formatters
export type DateInput = string | number | Date;

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DURATION_ADJUSTMENT = 1;

const getFormat = (locale: string, props?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat =>
	new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "numeric",
		...props,
	});

export const formatDate = (lang: string, date: DateInput, props?: Intl.DateTimeFormatOptions): string =>
	getFormat(lang, props).format(new Date(date)).replace(" ", " ");

export const formatDateRange = (lang: string, start: DateInput, end: DateInput): string => {
	const formatter = getFormat(lang);
	const startDate = new Date(start);
	const endDate = new Date(end);
	return `${formatter.format(startDate)} – ${formatter.format(endDate)}`.replace(" ", " ");
};

export const getDaysDuration = (startsAt: DateInput, endsAt: DateInput): number =>
	Math.max(
		(new Date(endsAt).getTime() - new Date(startsAt).getTime()) /
			MS_PER_SECOND /
			SECONDS_PER_MINUTE /
			MINUTES_PER_HOUR /
			HOURS_PER_DAY +
			DURATION_ADJUSTMENT,
		1,
	);
