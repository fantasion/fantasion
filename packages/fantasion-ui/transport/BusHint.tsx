export type BusHintProps = {
	enRoute?: boolean;
	inPlace?: boolean;
	enRouteLabel: string;
	inPlaceLabel: string;
};

export const BusHint = ({ enRoute, inPlace, enRouteLabel, inPlaceLabel }: BusHintProps) => {
	if (inPlace) {
		return <span className="text-muted">{`(${inPlaceLabel})`}</span>;
	}
	if (enRoute) {
		return <span className="text-muted">{`(${enRouteLabel})`}</span>;
	}
	return null;
};
