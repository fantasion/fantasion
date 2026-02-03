"use client";

import { Badge, NavbarToggler } from "@fantasion/ui";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useActiveOrder, useSite, useUser } from "../components/context";
import styles from "../components/layout.module.scss";
import type { Order } from "../components/orders/types";
import { UserName } from "../components/users";
import { BasketIcon, HamburgerMenuIcon } from "../content/icons";

const BASKET_NOTICE_DELAY_MS = 1000;

const BasketNotice = () => {
	const [show, setShow] = useState(false);
	const order = useActiveOrder() as Order | null;

	useEffect(() => {
		const to = setTimeout(() => setShow(true), BASKET_NOTICE_DELAY_MS);
		return () => clearTimeout(to);
	}, []);

	if (!order || (order.items?.length ?? 0) === 0) {
		return null;
	}

	return (
		<span className={styles.basketIcon}>
			{" "}
			<BasketIcon />
			<Badge pill={true} bg="danger" className={classnames(styles.basketBadge, { [styles.show]: show })}>
				{order.items?.length ?? 0}
			</Badge>
		</span>
	);
};

const CurrentUserName = () => <UserName user={useUser()} className={styles.menuUserName} />;

export function NavbarToggle() {
	const { user } = useSite();

	return (
		<div className={styles.menuWidget}>
			<NavbarToggler
				aria-controls="site-navbar"
				className={classnames(styles.navbarToggle, user?.passwordCreated && styles.navbarWithUser)}
			>
				<BasketNotice />
				<CurrentUserName />
				<HamburgerMenuIcon />
			</NavbarToggler>
		</div>
	);
}
