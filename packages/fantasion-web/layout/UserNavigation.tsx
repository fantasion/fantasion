"use client";

import { Nav, NavLink as NavLinkComponent } from "@fantasion/ui";
import { useActiveOrder, useSite } from "../components/context";
import styles from "../components/layout.module.scss";
import { BasketIcon, HomeIcon, IconLabel, LogoutIcon } from "../content/icons";
import { NavLink } from "../content/links";
import { Money } from "../content/money/Money";
import { useTranslation } from "../lib/i18n-context";

const LoginLink = () => {
	const { t } = useTranslation();
	const { user } = useSite();

	if (user) {
		return null;
	}

	return (
		<NavLink className="ms-lg-auto me-lg-2" route="login">
			{t("login")}
		</NavLink>
	);
};

const UserMenu = () => {
	const { t } = useTranslation();
	const { logout, user } = useSite();
	const order = useActiveOrder();
	const basketPrice = order?.price ?? 0;

	if (!user?.passwordCreated) {
		return null;
	}

	return (
		<Nav className={styles.userMenu}>
			<NavLink route="status">
				<IconLabel icon={HomeIcon} text={t("my-status")} />
			</NavLink>
			<NavLink route="basket">
				<IconLabel
					icon={BasketIcon}
					text={
						<>
							<span>{t("label-with-colon", { label: t("order-basket") })}</span> <Money amount={basketPrice} />
						</>
					}
				/>
			</NavLink>
			<NavLinkComponent onClick={logout}>
				<IconLabel icon={LogoutIcon} text={t("logout")} />
			</NavLinkComponent>
		</Nav>
	);
};

export function UserNavigation() {
	return (
		<>
			<LoginLink />
			<UserMenu />
		</>
	);
}
