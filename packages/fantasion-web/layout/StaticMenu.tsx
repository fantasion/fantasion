import { NavbarNavItem } from "@fantasion/ui";
import { getTranslations } from "next-intl/server";
import { NavLink } from "../content/links";
import { AboutDropdown } from "./AboutDropdown";

export async function StaticMenu() {
	const t = await getTranslations();
	return (
		<>
			<NavbarNavItem>
				<NavLink route="adventureList">{t("adventures-title")}</NavLink>
			</NavbarNavItem>
			<NavbarNavItem>
				<NavLink route="leisureCentreList">{t("leisure-centre-title")}</NavLink>
			</NavbarNavItem>
			<AboutDropdown />
			<NavbarNavItem>
				<NavLink route="contacts">{t("contacts-link")}</NavLink>
			</NavbarNavItem>
		</>
	);
}
