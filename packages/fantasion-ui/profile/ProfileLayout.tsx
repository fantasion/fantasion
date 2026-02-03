"use client";

import type { ReactNode } from "react";
import { Col, Container, Nav, Row } from "../index";

export type ProfileNavItem = {
	label: string;
	href?: string;
	active?: boolean;
	onClick?: () => void;
};

type ProfileNavProps = {
	items: ProfileNavItem[];
	renderNavLink: (item: ProfileNavItem, index: number) => ReactNode;
};

const ProfileNav = ({ items, renderNavLink }: ProfileNavProps) => (
	<Nav className="flex-md-column" variant="pills">
		{items.map((item, index) => renderNavLink(item, index))}
	</Nav>
);

export type ProfileLayoutProps = {
	children: ReactNode;
	navItems: ProfileNavItem[];
	renderNavLink: (item: ProfileNavItem, index: number) => ReactNode;
};

export const ProfileLayout = ({ children, navItems, renderNavLink }: ProfileLayoutProps) => (
	<Container>
		<Row>
			<Col md={4} lg={3} xl={2}>
				<ProfileNav items={navItems} renderNavLink={renderNavLink} />
			</Col>
			<Col md={8} lg={9} xl={10}>
				<main className="mt-3">{children}</main>
			</Col>
		</Row>
	</Container>
);
