import { type SocialNetwork, SocialNetworks as UiSocialNetworks } from "@fantasion/ui";
import type { HTMLAttributes } from "react";
import { EmailContactIcon, FacebookIcon, InstagramIcon } from "./icons";

const linkToNewWindow = (e: React.MouseEvent<HTMLAnchorElement>) => {
	e.preventDefault();
	window.open(e.currentTarget.href);
};

type SocialNetworksProps = HTMLAttributes<HTMLDivElement> & {
	subscribable?: boolean;
};

export const SocialNetworks = ({ subscribable = true, ...props }: SocialNetworksProps) => {
	const networks: SocialNetwork[] = [
		{ icon: FacebookIcon, link: "https://fb.com/fantasioncz" },
		{ icon: InstagramIcon, link: "https://www.instagram.com/fantasion_cz/" },
	];
	if (subscribable) {
		networks.push({ icon: EmailContactIcon, link: "mailto:info@fantasion.cz" });
	}
	return <UiSocialNetworks networks={networks} onExternalClick={linkToNewWindow} {...props} />;
};
