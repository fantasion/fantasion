"use client";

import { Article } from "../../content/Article";
import { Heading } from "../../content/content";
import { DateLabel } from "../../datetime/DateLabel";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { ProfileLayout } from "../family/ProfileLayout";
import type { MediaObjectType } from "../media";

type LogArticle = {
	id: number;
	date: string;
	title: string;
	media: MediaObjectType[];
	description?: string;
	text?: string;
	[key: string]: unknown;
};

type LogArticlesResponse = {
	results: LogArticle[];
};

type CircleLogContentProps = {
	articles: LogArticlesResponse;
};

export function CircleLogContent({ articles }: CircleLogContentProps) {
	const { t } = useTranslation();
	const title = t("circle-log");
	return (
		<ProfileLayout>
			<Breadcrumbs
				links={[
					{
						children: t("my-status"),
						route: "status",
					},
					{
						children: title,
					},
				]}
			/>
			<Heading level={1}>{title}</Heading>
			{articles.results.map((article) => (
				<Article {...article} className="mt-3" key={article.id} subTitle={<DateLabel date={article.date} />} />
			))}
		</ProfileLayout>
	);
}
