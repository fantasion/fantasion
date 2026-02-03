import { Button, FeatureSection, HeroSection } from "@fantasion/ui";
import classnames from "classnames";
import type { ReactNode } from "react";
import { FlavourTextCarousel } from "@/content/FlavourTextCarousel";
import { Heading } from "@/content/Heading";
import { MarkdownContent } from "@/content/MarkdownContent";
import { Link } from "../content/links";
import { useTranslation } from "../lib/i18n-context";
import styles from "./home.module.scss";

type Flavour = {
	quoteOwner: string;
	text: string;
	[key: string]: unknown;
};

type Article = {
	title: ReactNode;
	description: string;
	[key: string]: unknown;
};

const Witcher = () => (
	<div className={styles.witcher}>
		<div className={styles.witcherEyes} />
	</div>
);

const BackgroundShapes = () => <div className={styles.bgShapesInner} />;

export const HomeFlavour = ({ flavourTexts }: { flavourTexts: Flavour[] }) => {
	const { t } = useTranslation();

	return (
		<HeroSection
			className={styles.bgShapes}
			containerClassName={styles.container}
			hiddenTitle={t("fantasion-title")}
			background={<BackgroundShapes />}
			visual={<Witcher />}
		>
			<div className={styles.flavour}>
				<p className={classnames("text-center", styles.missionText)}>{t("fantasion-general-description")}</p>
				<FlavourTextCarousel
					className={classnames("d-none d-md-block", styles.flavourText)}
					flavourTexts={flavourTexts}
				/>
			</div>
		</HeroSection>
	);
};

export const HomeExpeditionSection = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation();

	return (
		<FeatureSection
			className={styles.expeditionSection}
			containerClassName={styles.expeditionContainer}
			titleClassName={styles.expeditionTitle}
			title={t("adventure-expeditions-title")}
			background={<div className={styles.expeditionSectionContent} />}
		>
			{children}
		</FeatureSection>
	);
};

export const HomeAbout = ({ article }: { article: Article }) => {
	const { t } = useTranslation();
	return (
		<article>
			<Heading level={2}>
				<Link route="about">{article.title}</Link>
			</Heading>
			<MarkdownContent>{article.description}</MarkdownContent>
			<Link as={Button} route="about" variant="link">
				{t("more-about-us")}
			</Link>
		</article>
	);
};
