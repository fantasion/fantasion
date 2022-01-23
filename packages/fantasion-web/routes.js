const cs = {
  about: {
    source: '/o-nas',
    destination: '/about',
  },
  contacts: {
    source: '/kontakty',
    destination: '/contact',
  },
  faq: {
    source: '/casto-kladene-otazky',
    destination: '/faq',
  },
  home: {
    source: '/',
    destination: '/index',
  },
  expeditionDetail: {
    source: '/tabory/:expeditionSlug',
    destination: '/expeditions/:expeditionSlug',
  },
  privacyPolicy: {
    source: '/zasady-ochrany-osobnich-udaju',
    destination: '/privacy-policy',
  },
  termsAndConditions: {
    source: '/obchodni-podminky',
    destination: '/terms-and-conditons',
  },
}

const routes = {
  cs,
}

const getRewrites = () =>
  Object.entries(routes).reduce(
    (aggr, [, paths]) => [...aggr, ...Object.values(paths)],
    []
  )

class MissingParam extends Error {}

const translateRoute = (path, params) =>
  path.replace(/(:[a-zA-Z]+)/g, (match) => {
    const param = match.substring(1)
    const value = params && params[param]
    if (!value) {
      throw new MissingParam(
        `Cannot translate path "${path}" without "${param}"`
      )
    }
    return value
  })

const reverse = (lang, name, params) =>
  `/${lang}${translateRoute(routes[lang][name].source, params)}`

module.exports = { getRewrites, reverse }
