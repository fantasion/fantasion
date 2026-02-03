import { BrandLogo, type BrandLogoProps } from "@fantasion/ui";
import logo from "../public/logo-0.1.2.svg";

// In Next.js App Router, static imports return { src, width, height } object
const logoSrc = typeof logo === "string" ? logo : logo.src;

export type SiteLogoProps = Omit<BrandLogoProps, "logoSrc" | "symbolId" | "viewBox">;

export const SiteLogo = (props: SiteLogoProps) => (
	<BrandLogo
		logoSrc={logoSrc}
		symbolId="logo"
		viewBox={`0 0 ${logo.width} ${logo.height}`}
		alt="Fantasion logo"
		width={32}
		height={32}
		{...props}
	/>
);
