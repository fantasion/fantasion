import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { useHeadingLevel } from './context'
import { asPage, MetaPage } from './meta'
import { GenericPage } from './layout'
import { Link } from './links'
import { MarkdownContent } from './content'
import { Heading, HeadingContext, ThumbGallery } from './media'

export const ArticleBody = ({ className, text }) => (
  <MarkdownContent className={classnames('mt-3', className)}>
    {text}
  </MarkdownContent>
)

export const ArticleLead = ({ text }) => (
  <i>
    <ArticleBody className="lead" text={text} />
  </i>
)

export const ArticleHeading = ({ selfLink, children }) => {
  const content = selfLink ? <Link {...selfLink}>{children}</Link> : children
  return <Heading>{content}</Heading>
}

export const Article = ({
  afterText,
  beforeText,
  description,
  media,
  selfLink,
  text,
  title,
  subTitle,
}) => {
  const headingLevel = useHeadingLevel()
  return (
    <HeadingContext baseLevel={headingLevel + 1}>
      <Container as="article">
        <Row>
          <Col lg={7}>
            <header>
              <ArticleHeading selfLink={selfLink}>{title}</ArticleHeading>
              {subTitle ? <p>{subTitle}</p> : null}
            </header>
            {description ? <ArticleLead text={description} /> : null}
            {beforeText ? <div>{beforeText}</div> : null}
            {text ? <ArticleBody text={text} /> : null}
            {afterText ? <div>{afterText}</div> : null}
          </Col>
          <Col lg={5}>
            <ThumbGallery media={media} />
          </Col>
        </Row>
      </Container>
    </HeadingContext>
  )
}

export const StaticArticlePage = asPage(({ article }) => (
  <GenericPage>
    <MetaPage title={article.title} description={article.description} />
    <Article
      title={article.title}
      description={article.description}
      media={article.media}
      text={article.text}
    />
  </GenericPage>
))
