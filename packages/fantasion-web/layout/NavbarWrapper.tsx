"use client";

import { Navbar } from "@fantasion/ui";
import classnames from "classnames";
import type { ReactNode } from "react";
import { useState } from "react";
import styles from "../components/layout.module.scss";

type NavbarWrapperProps = {
	children: ReactNode;
	sticky?: boolean;
	thin?: boolean;
};

export function NavbarWrapper({ children, sticky, thin }: NavbarWrapperProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Navbar
			className={classnames("mb-3 pt-1 pb-1", styles.navbar, {
				[styles.navbarExpanded]: expanded,
				[styles.thin]: thin,
			})}
			expand="lg"
			expanded={expanded}
			sticky={sticky ? "top" : undefined}
			onToggle={setExpanded}
			scrollThreshold={30}
			scrolledClassName={styles.navbarInverse}
			autoClose={true}
		>
			{children}
		</Navbar>
	);
}
