import type { ComponentType, HTMLAttributes } from "react";
import { SocialIcon } from "./SocialIcon";

export type SocialNetwork = {
	icon: ComponentType;
	link: string;
};

export type SocialNetworksProps = HTMLAttributes<HTMLDivElement> & {
	networks: SocialNetwork[];
	onExternalClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const SocialNetworks = ({ networks, onExternalClick, ...props }: SocialNetworksProps) => (
	<div {...props}>
		{networks.map((network, index) => (
			<SocialIcon key={index} icon={network.icon} link={network.link} onExternalClick={onExternalClick} />
		))}
	</div>
);
