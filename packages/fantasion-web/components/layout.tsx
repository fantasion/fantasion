"use client";

import {
	Badge,
	Container,
	Nav,
	Navbar,
	NavbarBrand,
	NavbarCollapse,
	NavbarToggler,
	NavDropdown,
	NavDropdownItem,
	NavLink as NavLinkComponent,
} from "@fantasion/ui";
import classnames from "classnames";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { BasketIcon, HamburgerMenuIcon, HomeIcon, IconLabel, LogoutIcon } from "../content/icons";
import { Link, NavLink } from "../content/links";
import { Money } from "../content/money/Money";
import { Footer } from "../layout/Footer";
import { Runes } from "../layout/Runes";
import { useTranslation } from "../lib/i18n-context";
import { Alerts } from "./alerts";
import { useActiveOrder, useSite, useUser } from "./context";
import styles from "./layout.module.scss";
import type { Order } from "./orders/types";
import { SiteLogo } from "./SiteLogo";
import { UserName } from "./users";

const expandOn = "lg";
const BASKET_NOTICE_DELAY_MS = 1000;

const BasketNotice = () => {
	const [show, setShow] = useState(false);
	const order = useActiveOrder() as Order | null;
	const icon = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		const to = setTimeout(() => setShow(true), BASKET_NOTICE_DELAY_MS);
		return () => clearTimeout(to);
	}, []);

	if (!order || (order.items?.length ?? 0) === 0) {
		return null;
	}

	return (
		<span className={styles.basketIcon} ref={icon}>
			{" "}
			<BasketIcon />
			<Badge pill={true} bg="danger" className={classnames(styles.basketBadge, { [styles.show]: show })}>
				{order.items?.length ?? 0}
			</Badge>
		</span>
	);
};

const CurrentUserName = () => <UserName user={useUser()} className={styles.menuUserName} />;

const SiteMenu = () => {
	const { t } = useTranslation();
	const { user } = useSite();
	const aboutNavId = useId();
	return (
		<Nav className="flex-grow-1">
			<NavLink route="adventureList">{t("adventures-title")}</NavLink>
			<NavLink route="leisureCentreList">{t("leisure-centre-title")}</NavLink>
			<NavDropdown title={t("about-fantasion")} id={aboutNavId}>
				<Link as={NavDropdownItem} route="about">
					{t("about-us")}
				</Link>
				<Link as={NavDropdownItem} route="team">
					{t("our-team")}
				</Link>
			</NavDropdown>
			<NavLink route="contacts">{t("contacts-link")}</NavLink>
			{!user && (
				<NavLink className="ms-lg-auto me-lg-2" key="login" route="login">
					{t("login")}
				</NavLink>
			)}
		</Nav>
	);
};

const UserMenu = () => {
	const { t } = useTranslation();
	const { logout, user } = useSite();
	const order = useActiveOrder();
	const basketPrice = order?.price ?? 0;
	const items = [
		...(user?.passwordCreated
			? [
					<NavLink key="status" route="status">
						<IconLabel icon={HomeIcon} text={t("my-status")} />
					</NavLink>,
					<NavLink key="basket" route="basket">
						<IconLabel
							icon={BasketIcon}
							text={
								<>
									<span>{t("label-with-colon", { label: t("order-basket") })}</span> <Money amount={basketPrice} />
								</>
							}
						/>
					</NavLink>,
					<NavLinkComponent key="logout" onClick={logout}>
						<IconLabel icon={LogoutIcon} text={t("logout")} />
					</NavLinkComponent>,
				]
			: []),
	].filter(Boolean);

	if (items.length === 0) {
		return null;
	}

	return <Nav className={styles.userMenu}>{items}</Nav>;
};

type SiteNavbarProps = {
	fixed?: boolean;
	sticky?: boolean;
	thin?: boolean;
};

export const SiteNavbar = ({ fixed, sticky, thin }: SiteNavbarProps) => {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const { user } = useSite();
	const navbarCollapseId = useId();

	return (
		<Navbar
			className={classnames("mb-3 pt-1 pb-1", styles.navbar, {
				[styles.navbarExpanded]: expanded,
				[styles.thin]: thin,
			})}
			expand={expandOn}
			expanded={expanded}
			sticky={sticky ? "top" : undefined}
			fixed={fixed ? "top" : undefined}
			onToggle={setExpanded}
			scrollThreshold={30}
			scrolledClassName={styles.navbarInverse}
			autoClose={true}
		>
			<Container className="position-relative">
				<Link
					as={NavbarBrand}
					route="home"
					className={classnames(styles.navbarBrand, "d-inline-flex align-items-center")}
				>
					<SiteLogo className={styles.logo} /> <span>{t("fantasion-brand")}</span>
				</Link>
				<NavbarCollapse id={navbarCollapseId}>
					<SiteMenu />
					<UserMenu />
				</NavbarCollapse>
				<div className={styles.menuWidget}>
					<NavbarToggler
						aria-controls={navbarCollapseId}
						className={classnames(styles.navbarToggle, user?.passwordCreated && styles.navbarWithUser)}
					>
						<BasketNotice />
						<CurrentUserName />
						<HamburgerMenuIcon />
					</NavbarToggler>
				</div>
			</Container>
		</Navbar>
	);
};

type PageContentProps = {
	children: ReactNode;
};

type GenericPageProps = {
	children: ReactNode;
	thin?: boolean;
};

export const PageContent = ({ children }: PageContentProps) => <div className={styles.content}>{children}</div>;

export const GenericPage = ({ children, thin }: GenericPageProps) => (
	<>
		<PageContent>
			<SiteNavbar sticky={true} thin={thin} />

			<main>
				<Alerts />
				{children}
			</main>
			<Runes />
		</PageContent>
		<Footer />
	</>
);
