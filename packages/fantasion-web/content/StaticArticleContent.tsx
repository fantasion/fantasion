"use client";

import { Container } from "@fantasion/ui";
import type { MediaObjectType } from "../components/media";
import { Article } from "./Article";

type StaticArticle = {
	title: string;
	description?: string;
	media: unknown[];
	text: string;
};

type StaticArticleContentProps = {
	article: StaticArticle;
};

export function StaticArticleContent({ article }: StaticArticleContentProps) {
	return (
		<Container>
			<Article
				title={article.title}
				description={article.description}
				media={article.media as MediaObjectType[]}
				text={article.text}
			/>
		</Container>
	);
}
