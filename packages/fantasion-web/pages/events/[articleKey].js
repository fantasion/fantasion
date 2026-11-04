import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from '../../components/articles'
import { asPage, MetaPage } from '../../components/meta'
import { EventSignupForm } from '../../components/eventSignup'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { getArticleByKey } from '../../server/articles'
import { useSite } from '../../components/context'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../../server/props'

export const getServerSideProps = withPageProps(
  async ({ fetch, params }) => ({
    props: {
      article: await getArticleByKey(fetch, params.articleKey),
    },
  })
)

const EventSignupPage = ({ article }) => {
  const { t } = useTranslation()
  const { fetch } = useSite()
  const [submitted, setSubmitted] = useState(false)

  const handleSignup = async (values) => {
    await fetch.post('/event-signups', {
      body: {
        article_key: article.key,
        name: values.name,
        email: values.email,
        phone: values.phone || '',
        note: values.note || '',
      },
    })
    setSubmitted(true)
  }

  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Container>
        <Article
          title={article.title}
          description={article.description}
          media={article.media}
          text={article.text}
          afterText={
            <Row className="mt-4">
              <Col md={6} lg={5} xl={4}>
                <Heading relativeLevel={2}>{t('event-signup-heading')}</Heading>
                {submitted ? (
                  <Alert variant="success">{t('event-signup-success')}</Alert>
                ) : (
                  <EventSignupForm onSubmit={handleSignup} />
                )}
              </Col>
            </Row>
          }
        />
      </Container>
    </GenericPage>
  )
}

export default asPage(EventSignupPage)
