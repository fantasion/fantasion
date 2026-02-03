"use client";

import { Container } from "@fantasion/ui";
import { Article } from "../../content/Article";
import { slug } from "../../slugs";
import type { MediaObjectType } from "../media";
import { ExpeditionLinks } from "./expeditionLinks";

type Expedition = {
	id: number;
	title: string;
};

type ExpeditionTheme = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	media: MediaObjectType[];
	expeditions: Expedition[];
};

type ExpeditionThemeArticleProps = {
	theme: ExpeditionTheme;
};

type ExpeditionThemeListProps = {
	expeditionThemes: ExpeditionTheme[];
};

const ExpeditionThemeArticle = ({ theme }: ExpeditionThemeArticleProps) => (
	<Container>
		<Article
			description={theme.description}
			media={theme.media}
			text={theme.detailedDescription}
			selfLink={{
				route: "adventureDetail",
				params: { expeditionThemeSlug: slug(theme) },
			}}
			afterText={theme.expeditions.length === 0 ? null : <ExpeditionLinks expeditions={theme.expeditions} />}
			title={theme.title}
		/>
	</Container>
);

export const ExpeditionThemeList = ({ expeditionThemes }: ExpeditionThemeListProps) =>
	expeditionThemes.map((expeditionTheme: ExpeditionTheme) => (
		<ExpeditionThemeArticle key={expeditionTheme.id} theme={expeditionTheme} />
	));
