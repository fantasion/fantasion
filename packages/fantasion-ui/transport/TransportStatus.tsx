import type { ComponentType, ReactNode } from "react";
import type { TransportType } from "./index";
import { TRANSPORT_DEPARTED } from "./index";
import { TransportGpsLink } from "./TransportGpsLink";
import { TravelSpinner } from "./TravelSpinner/TravelSpinner";

export type TransportStatusProps = {
	transport: TransportType;
	downIcon: ComponentType;
	linkComponent: ComponentType<{ href?: string; external?: boolean; children?: ReactNode }>;
	gpsLinkLabel: string;
};

export const TransportStatus = ({
	transport,
	downIcon: DownIcon,
	linkComponent,
	gpsLinkLabel,
}: TransportStatusProps) => {
	if (transport.status === TRANSPORT_DEPARTED) {
		return (
			<div className="d-flex align-items-center">
				<TravelSpinner />
				<TransportGpsLink url={transport.gpsTrackingUrl} linkComponent={linkComponent} label={gpsLinkLabel} />
			</div>
		);
	}
	return <DownIcon />;
};
