import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from '../../components/articles'
import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { Link } from '../../components/links'
import { getArticleByKey } from '../../server/articles'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../../server/props'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => ({
  props: {
    article: await getArticleByKey(fetch, params.articleKey),
  },
}))

const EventSignupPage = ({ article }) => {
  const { t } = useTranslation()
  const formEmbedUrl = article.signupFormEmbedUrl || ''

  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Container>
        <p className="mt-3 mb-0">
          <Link route="home">{t('event-back-home')}</Link>
        </p>
        <Article
          title={article.title}
          description={article.description}
          media={article.media}
          text={article.text}
          afterText={
            formEmbedUrl ? (
              <Row className="mt-4 mb-5">
                <Col lg={10} xl={8}>
                  <Heading relativeLevel={2}>
                    {t('event-signup-heading')}
                  </Heading>
                  <div className="mt-3">
                    <iframe
                      title={t('event-signup-heading')}
                      src={formEmbedUrl}
                      width="100%"
                      height="1400"
                      frameBorder="0"
                      marginHeight="0"
                      marginWidth="0"
                      style={{ border: 0, minHeight: 1400 }}
                    >
                      {t('event-signup-iframe-fallback')}
                    </iframe>
                  </div>
                </Col>
              </Row>
            ) : null
          }
        />
      </Container>
    </GenericPage>
  )
}

export default asPage(EventSignupPage)
