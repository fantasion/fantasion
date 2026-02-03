import type React from "react";

export type SocialIconProps = {
	icon: React.ComponentType;
	link: string;
	onExternalClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const SocialIcon = ({ icon: IconComponent, link, onExternalClick }: SocialIconProps) => (
	<a href={link} onClick={link.startsWith("http") ? onExternalClick : undefined}>
		<IconComponent />
	</a>
);
