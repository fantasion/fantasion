import clsx from "clsx";
import type { ReactNode } from "react";
import { Col, Container, Row } from "../../grid/index.js";
import { type MediaObjectType, ThumbGallery } from "../../media/index.js";
import { Heading } from "../Heading.js";
import { MarkdownContent } from "../MarkdownContent/index.js";
import { Section } from "../Section.js";
import styles from "./Article.module.scss";

// ============================================
// ARTICLE BODY
// ============================================

export interface ArticleBodyProps {
	/** Additional class name */
	className?: string;
	/** Markdown text content */
	text?: string;
	/** Offset for heading levels in markdown */
	headingOffset?: number;
}

/**
 * ArticleBody - Renders markdown content for an article.
 */
export const ArticleBody = ({ className, text, headingOffset = 0 }: ArticleBodyProps) => {
	if (!text) {
		return null;
	}
	return (
		<MarkdownContent className={clsx(styles.body, className)} headingOffset={headingOffset}>
			{text}
		</MarkdownContent>
	);
};

ArticleBody.displayName = "ArticleBody";

// ============================================
// ARTICLE LEAD
// ============================================

export interface ArticleLeadProps {
	/** Additional class name */
	className?: string;
	/** Lead/intro text (rendered in italics) */
	text?: string;
}

/**
 * ArticleLead - Renders the lead/intro paragraph in italics.
 */
export const ArticleLead = ({ className, text }: ArticleLeadProps) => {
	if (!text) {
		return null;
	}
	return <ArticleBody className={clsx(styles.lead, className)} text={text} />;
};

ArticleLead.displayName = "ArticleLead";

// ============================================
// ARTICLE HEADING
// ============================================

export interface ArticleHeadingProps {
	/** Heading level (1-6) */
	level: number;
	/** Heading content */
	children: ReactNode;
	/** Optional link URL */
	href?: string;
	/** Custom link renderer (for framework-specific routing) */
	renderLink?: (props: { href: string; children: ReactNode }) => ReactNode;
}

/**
 * ArticleHeading - Article heading with optional link.
 */
export const ArticleHeading = ({ level, children, href, renderLink }: ArticleHeadingProps) => {
	let content: ReactNode = children;

	if (href) {
		if (renderLink) {
			content = renderLink({ href, children });
		} else {
			content = <a href={href}>{children}</a>;
		}
	}

	return <Heading level={level}>{content}</Heading>;
};

ArticleHeading.displayName = "ArticleHeading";

// ============================================
// ARTICLE STUB
// ============================================

export interface ArticleStubProps {
	/** Heading content */
	heading: ReactNode;
	/** Article text content (markdown) */
	text: string;
	/** Additional class name */
	className?: string;
	/** Heading level */
	level?: number;
}

/**
 * ArticleStub - A compact article with just heading and text.
 */
export const ArticleStub = ({ heading, text, className, level = 3 }: ArticleStubProps) => (
	<Section as="article" className={className}>
		<Heading level={level}>{heading}</Heading>
		<ArticleBody text={text} headingOffset={level} />
	</Section>
);

ArticleStub.displayName = "ArticleStub";

// ============================================
// ARTICLE
// ============================================

export interface ArticleProps {
	/** Additional class name */
	className?: string;
	/** Article title */
	title: ReactNode;
	/** Article description/lead (shown in italics) */
	description?: string;
	/** Subtitle shown below the title */
	subTitle?: ReactNode;
	/** Main article text (markdown) */
	text?: string;
	/** Media gallery items */
	media?: MediaObjectType[];
	/** Link URL for the title */
	titleHref?: string;
	/** Custom link renderer for the title */
	renderTitleLink?: (props: { href: string; children: ReactNode }) => ReactNode;
	/** Content to show before the main text */
	beforeText?: ReactNode;
	/** Content to show after the main text */
	afterText?: ReactNode;
	/** Heading level for the title */
	level?: number;
}

/**
 * Article - A full article layout with title, description, text, and media.
 *
 * @example
 * ```tsx
 * <Article
 *   title="My Article"
 *   description="A brief introduction"
 *   text="# Main Content\n\nThis is the article body..."
 *   media={[{ src: '/image.jpg', alt: 'Photo' }]}
 * />
 * ```
 */
export const Article = ({
	afterText,
	beforeText,
	className,
	description,
	media = [],
	titleHref,
	renderTitleLink,
	text,
	title,
	subTitle,
	level = 2,
}: ArticleProps) => (
	<Container as="article" className={className}>
		<Row>
			<Col lg={7}>
				<header>
					<ArticleHeading href={titleHref} renderLink={renderTitleLink} level={level}>
						{title}
					</ArticleHeading>
					{subTitle ? <p className={styles.subtitle}>{subTitle}</p> : null}
				</header>
				{description ? <ArticleLead text={description} /> : null}
				{beforeText ? <div>{beforeText}</div> : null}
				{text ? <ArticleBody text={text} headingOffset={level} /> : null}
				{afterText ? <div>{afterText}</div> : null}
			</Col>
			<Col lg={5}>
				<ThumbGallery media={media} />
			</Col>
		</Row>
	</Container>
);

Article.displayName = "Article";
