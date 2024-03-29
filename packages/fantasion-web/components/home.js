import Button from 'react-bootstrap/Button'
import classnames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { Link } from './links'
import { Heading, useRotatingIndex } from './media'
import { MarkdownContent } from './content'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'next-i18next'

import styles from './home.module.scss'

const FlavourText = ({ quoteOwner, text, ...props }) => {
  const [height, setHeight] = useState(32)
  const lineRef = useRef()

  useEffect(() => {
    if (lineRef.current) {
      setHeight(lineRef.current.clientHeight)
    }
  }, [quoteOwner, text])

  return (
    <blockquote {...props} style={{ height }}>
      <span className={styles.flavourLine} ref={lineRef}>
        <div className={styles.flavourQuote}>
          &quot;
          <MarkdownContent>{text}</MarkdownContent>
          &quot;
        </div>
        {' -'}&nbsp;
        <span>{quoteOwner}</span>
      </span>
    </blockquote>
  )
}

const FlavourTextCarousel = ({ flavourTexts, ...props }) => {
  const [flavourIndex] = useRotatingIndex(flavourTexts, 9000)
  const flavour = flavourTexts[flavourIndex]
  if (!flavour) {
    return null
  }
  return (
    <FlavourText
      quoteOwner={flavour.quoteOwner}
      text={flavour.text}
      {...props}
    />
  )
}

const Witcher = () => {
  return (
    <div className={styles.witcher}>
      <div className={styles.witcherEyes} />
    </div>
  )
}

export const HomeFlavour = ({ flavourTexts }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.bgShapes}>
      <Container className={styles.container} fluid="xl">
        <Row className="align-items-center">
          <Col xs={12} md={6} className="d-flex justify-content-center">
            <h1 className="d-none">{t('fantasion-title')}</h1>
            <div className={styles.flavour}>
              <p className={classnames('text-center', styles.missionText)}>
                {t('fantasion-general-description')}
              </p>
              <FlavourTextCarousel
                className={classnames('d-none d-md-block', styles.flavourText)}
                flavourTexts={flavourTexts}
              />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <Witcher />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export const HomeAbout = ({ article }) => {
  return (
    <article>
      <Heading>
        <Link route="about">{article.title}</Link>
      </Heading>
      <MarkdownContent>{article.description}</MarkdownContent>
      <Link as={Button} route="about" variant="link">
        Více o nás
      </Link>
    </article>
  )
}
