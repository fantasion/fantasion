import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import React, { useState } from 'react'

import { asPage, MetaPage } from '../components/meta'
import { CreatePasswordForm } from '../components/register'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { setCookies } from 'cookies-next'
import { TOKEN_COOKIE } from '../api'
import { useAlerts, useSite } from '../components/context'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

const parseSecret = (query) => query.s

export const getServerSideProps = withPageProps(
  async ({ fetch, query, req, res }) => {
    const secret = parseSecret(query)
    const { user, token } = await fetch(`/users/verifications/${secret}`)
    setCookies(TOKEN_COOKIE, token, {
      sameSite: 'strict',
      req,
      res,
    })
    return {
      props: {
        secret,
        token,
        user,
      },
    }
  }
)

const VerifyEmailPage = ({ secret }) => {
  const { fetch, user } = useSite()
  const { t } = useTranslation()
  const [verified, setVerified] = useState(user.passwordCreated)
  const alerts = useAlerts()
  const router = useRouter()
  const onSubmit = async (values) => {
    const res = await fetch.post(`/users/create-password/${secret}`, {
      body: values,
    })
    setCookies(TOKEN_COOKIE, res.token, {
      sameSite: 'strict',
    })
    setVerified(res.user.passwordCreated)
    alerts.add({
      id: 'verification-finished',
      severity: 'success',
      text: t('verification-finished'),
    })

    const redirectTo = localStorage.getItem('redirectTo')
    if (redirectTo) {
      router.push(redirectTo)
      localStorage.removeItem('redirectTo')
    }
  }
  return (
    <GenericPage>
      <MetaPage
        noRobots
        title={t('verification-title')}
        description={t('verification-general-description')}
      />
      <Container>
        <Row>
          <Col lg={{ offset: 3, span: 6 }}>
            <Collapse in={!verified}>
              <div>
                <Heading>{t('verification-title')}</Heading>
                <hr />
                <div>
                  <p>{t('verification-success')}</p>
                  <CreatePasswordForm onSubmit={onSubmit} />
                </div>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(VerifyEmailPage)
