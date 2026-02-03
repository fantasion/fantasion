"use client";

import { NavDropdown, NavDropdownItem } from "@fantasion/ui";
import { useId } from "react";
import { Link } from "../content/links";
import { useTranslation } from "../lib/i18n-context";

export function AboutDropdown() {
	const { t } = useTranslation();
	const dropdownId = useId();
	return (
		<NavDropdown title={t("about-fantasion")} id={dropdownId}>
			<Link as={NavDropdownItem} route="about">
				{t("about-us")}
			</Link>
			<Link as={NavDropdownItem} route="team">
				{t("our-team")}
			</Link>
		</NavDropdown>
	);
}
