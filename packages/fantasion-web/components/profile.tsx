"use client";

import { type ProfileNavItem, ProfileLayout as UIProfileLayout } from "@fantasion/ui";
import type { ReactNode } from "react";
import { NavLink } from "../content/links";
import { useTranslation } from "../lib/i18n-context";

export const ProfileLayout = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation();

	const navItems: ProfileNavItem[] = [
		{ label: t("my-status"), href: "status" },
		{ label: t("family-participants"), href: "participants" },
		{ label: t("circle-log"), href: "circleLog" },
	];

	const renderNavLink = (item: ProfileNavItem, index: number) => (
		<NavLink key={index} route={item.href || ""}>
			{item.label}
		</NavLink>
	);

	return (
		<UIProfileLayout navItems={navItems} renderNavLink={renderNavLink}>
			{children}
		</UIProfileLayout>
	);
};
