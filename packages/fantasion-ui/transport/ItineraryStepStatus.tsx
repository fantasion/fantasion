import type { ComponentType } from "react";
import { IconLabel } from "../content/IconLabel.js";

export type ItineraryStepStatusProps = {
	boarding?: boolean;
	departed?: boolean;
	arrived?: boolean;
	checkIcon: ComponentType;
	busSpinnerIcon: ComponentType;
	departedLabel: string;
	arrivedLabel: string;
	boardingLabel: string;
};

export const ItineraryStepStatus = ({
	boarding,
	departed,
	arrived,
	checkIcon,
	busSpinnerIcon,
	departedLabel,
	arrivedLabel,
	boardingLabel,
}: ItineraryStepStatusProps) => {
	if (departed) {
		return <IconLabel icon={checkIcon} text={departedLabel} />;
	}
	if (arrived) {
		return <IconLabel icon={checkIcon} text={arrivedLabel} />;
	}
	if (boarding) {
		return <IconLabel icon={busSpinnerIcon} text={boardingLabel} />;
	}
	return null;
};
