import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React, { useEffect, useRef, useState } from 'react'
import Row from 'react-bootstrap/Row'

import { Article } from '../../components/articles'
import { asPage, MetaPage } from '../../components/meta'
import { EventSignupForm } from '../../components/eventSignup'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { Link } from '../../components/links'
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
  const thanksRef = useRef(null)

  useEffect(() => {
    if (submitted && thanksRef.current) {
      thanksRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [submitted])

  const handleSignup = async (values) => {
    await fetch.post('/event-signups', {
      body: {
        article_key: article.key,
        answers: values.answers,
        website: values.website || '',
        form_started: values.form_started || '',
      },
    })
    setSubmitted(true)
  }

  const signupFields = article.signupFields || []

  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Container>
        <p className="mt-3 mb-0">
          <Link route="home">{t('event-back-home')}</Link>
        </p>
        {submitted ? (
          <section className="mt-4 mb-5" ref={thanksRef}>
            <Heading>{t('event-signup-thanks-title')}</Heading>
            <p className="mt-3">{t('event-signup-thanks-body')}</p>
            <p>{t('event-signup-thanks-followup')}</p>
            <div className="mt-4">
              <Link as={Button} route="home">
                {t('event-signup-thanks-home')}
              </Link>
            </div>
          </section>
        ) : (
          <Article
            title={article.title}
            description={article.description}
            media={article.media}
            text={article.text}
            afterText={
              <Row className="mt-4">
                <Col md={6} lg={5} xl={4}>
                  <Heading relativeLevel={2}>
                    {t('event-signup-heading')}
                  </Heading>
                  <EventSignupForm
                    fields={signupFields}
                    onSubmit={handleSignup}
                  />
                </Col>
              </Row>
            }
          />
        )}
      </Container>
    </GenericPage>
  )
}

export default asPage(EventSignupPage)
