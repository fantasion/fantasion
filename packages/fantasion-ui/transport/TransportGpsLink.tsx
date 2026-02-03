import type { ComponentType, ReactNode } from "react";

export type TransportGpsLinkProps = {
	url?: string;
	linkComponent: ComponentType<{ href?: string; external?: boolean; children?: ReactNode }>;
	label: string;
};

export const TransportGpsLink = ({ url, linkComponent: LinkComponent, label }: TransportGpsLinkProps) => {
	if (!url) {
		return null;
	}
	return (
		<div className="ms-2">
			<LinkComponent href={url} external={true}>
				{label}
			</LinkComponent>
		</div>
	);
};
