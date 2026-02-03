import type { ReactNode } from "react";
import { Alerts } from "../components/alerts";
import styles from "../components/layout.module.scss";
import { Footer } from "./Footer";
import { Runes } from "./Runes";
import { SiteNavbar } from "./SiteNavbar";

type PageLayoutProps = {
	children: ReactNode;
	thin?: boolean;
};

export function PageLayout({ children, thin }: PageLayoutProps) {
	return (
		<>
			<div className={styles.content}>
				<SiteNavbar sticky={true} thin={thin} />
				<main>
					<Alerts />
					{children}
				</main>
				<Runes />
			</div>
			<Footer />
		</>
	);
}
