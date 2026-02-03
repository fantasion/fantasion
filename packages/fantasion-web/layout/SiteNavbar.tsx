import { NavbarBrand, NavbarCollapse, NavbarContainer, NavbarNav } from "@fantasion/ui";
import classnames from "classnames";
import { getTranslations } from "next-intl/server";
import styles from "../components/layout.module.scss";
import { SiteLogo } from "../components/SiteLogo";
import { Link } from "../content/links";
import { NavbarToggle } from "./NavbarToggle";
import { NavbarWrapper } from "./NavbarWrapper";
import { StaticMenu } from "./StaticMenu";
import { UserNavigation } from "./UserNavigation";

// Navbar behaviour requirements:
//
// - The main menu (StaticMenu) is responsive: collapsed on small viewports,
//   expanded inline on lg+.
// - The user menu (UserNavigation) is always collapsed into a dropdown and
//   always expandable via the toggle button, regardless of viewport size.
// - The toggle button is always visible for logged-in users (showing user
//   name, basket icon, and hamburger icon). On small viewports it controls
//   both the main menu and the user menu. On lg+ it only controls the user
//   menu dropdown.
//
type SiteNavbarProps = {
	sticky?: boolean;
	thin?: boolean;
};

export async function SiteNavbar({ sticky, thin }: SiteNavbarProps) {
	const t = await getTranslations();

	return (
		<NavbarWrapper sticky={sticky} thin={thin}>
			<NavbarContainer className="position-relative">
				<Link
					as={NavbarBrand}
					route="home"
					className={classnames(styles.navbarBrand, "d-inline-flex align-items-center")}
				>
					<SiteLogo className={styles.logo} /> <span>{t("fantasion-brand")}</span>
				</Link>
				<NavbarCollapse>
					<NavbarNav className="flex-grow-1">
						<StaticMenu />
					</NavbarNav>
					<UserNavigation />
				</NavbarCollapse>
				<NavbarToggle />
			</NavbarContainer>
		</NavbarWrapper>
	);
}
