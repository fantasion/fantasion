import { createStaticArticlePageGetter } from '../server/articles'
import { StaticArticlePage } from '../components/articles'

export const getServerSideProps = createStaticArticlePageGetter(
  'terms-and-conditions'
)

export default StaticArticlePage
