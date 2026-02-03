import { Col, Container, Row } from "@fantasion/ui";
import type React from "react";

// Re-export base components from @fantasion/ui
export {
	Article as ArticleBase,
	ArticleBody,
	type ArticleBodyProps,
	type ArticleHeadingProps,
	ArticleLead,
	type ArticleLeadProps,
	type ArticleProps as ArticleBaseProps,
	ArticleStub,
	type ArticleStubProps,
} from "@fantasion/ui";

import { ArticleHeading as UiArticleHeading } from "@fantasion/ui";
import { GenericPage } from "../components/layout";
import type { MediaObjectType } from "../components/media";
import { ThumbGallery } from "../components/media";
import { MetaPage } from "../components/meta";
import { MarkdownContent } from "./content";
import { Link } from "./links";

type LinkLike = {
	route: string;
	params?: Record<string, string>;
};

type ArticleHeadingProps = {
	selfLink?: LinkLike;
	children: React.ReactNode;
	level: number;
};

type ArticleProps = {
	className?: string;
	title: React.ReactNode;
	description?: string;
	subTitle?: React.ReactNode;
	text?: string;
	media?: MediaObjectType[];
	selfLink?: LinkLike;
	beforeText?: React.ReactNode;
	afterText?: React.ReactNode;
	level?: number;
};

type StaticArticle = {
	title: string;
	description?: string;
	media: MediaObjectType[];
	text: string;
};

/**
 * ArticleHeading with Link support for fantasion routing.
 */
export const ArticleHeading = ({ selfLink, children, level }: ArticleHeadingProps) => {
	if (selfLink) {
		return (
			<UiArticleHeading
				level={level}
				href={selfLink.route}
				renderLink={({ children: linkChildren }) => <Link {...selfLink}>{linkChildren}</Link>}
			>
				{children}
			</UiArticleHeading>
		);
	}
	return <UiArticleHeading level={level}>{children}</UiArticleHeading>;
};

/**
 * Article with Link and MediaObjectType support for fantasion.
 */
export const Article = ({
	afterText,
	beforeText,
	className,
	description,
	media = [],
	selfLink,
	text,
	title,
	subTitle,
	level = 2,
}: ArticleProps) => (
	<Container as="article" className={className}>
		<Row>
			<Col lg={7}>
				<header>
					<ArticleHeading selfLink={selfLink} level={level}>
						{title}
					</ArticleHeading>
					{subTitle ? <p>{subTitle}</p> : null}
				</header>
				{description ? (
					<MarkdownContent className="fst-italic mt-3" headingOffset={level}>
						{description}
					</MarkdownContent>
				) : null}
				{beforeText ? <div>{beforeText}</div> : null}
				{text ? (
					<MarkdownContent className="mt-3" headingOffset={level}>
						{text}
					</MarkdownContent>
				) : null}
				{afterText ? <div>{afterText}</div> : null}
			</Col>
			<Col lg={5}>
				<ThumbGallery media={media} />
			</Col>
		</Row>
	</Container>
);

export const StaticArticlePage = ({ article }: { article: StaticArticle }) => (
	<GenericPage>
		<MetaPage title={article.title} description={article.description || ""} />
		<Container>
			<Article
				title={article.title}
				description={article.description}
				media={article.media}
				text={article.text}
				level={1}
			/>
		</Container>
	</GenericPage>
);
