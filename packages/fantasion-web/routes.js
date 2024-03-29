const { InternalServerError } = require('./errors')

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
  adventureList: {
    source: '/dobrodruzstvi',
    destination: '/adventures',
  },
  bestiary: {
    source: '/bestiar',
    destination: '/bestiary',
  },
  monsterDetail: {
    source: '/monsters/:monsterSlug',
    destination: '/monsters/:monsterSlug',
  },
  confirmRegistration: {
    source: '/potvrzeni-registrace',
    destination: '/confirm-registration',
  },
  expeditionDetail: {
    source: '/tabory/:expeditionSlug',
    destination: '/expeditions/:expeditionSlug',
  },
  expeditionBatchDetail: {
    source: '/turnusy/:expeditionBatchSlug',
    destination: '/expedition-batches/:expeditionBatchSlug',
  },
  transportDetail: {
    source: '/doprava/:transportId',
    destination: '/transports/:transportId',
  },
  forgottenPassword: {
    source: '/zapomenute-heslo',
    destination: '/forgotten-password',
  },
  adventureDetail: {
    source: '/dobrodruzstvi/:expeditionThemeSlug',
    destination: '/adventures/:expeditionThemeSlug',
  },
  leisureCentreList: {
    source: '/stredisko',
    destination: '/leisure-centres',
  },
  leisureCentreDetail: {
    source: '/strediska/:leisureCentreSlug',
    destination: '/leisure-centres/:leisureCentreSlug',
  },
  basket: {
    source: '/objednavka/kosik',
    destination: '/orders/basket',
  },
  paymentAndDelivery: {
    source: '/objednavka/platba-a-doruceni',
    destination: '/orders/payment-and-delivery',
  },
  checkout: {
    source: '/objednavka/potvrzeni',
    destination: '/orders/checkout',
  },
  login: {
    source: '/prihlaseni',
    destination: '/login',
  },
  participants: {
    source: '/druzina/ucastnici',
    destination: '/circle/participants',
  },
  participantDetail: {
    source: '/druzina/ucastnici/:participantId',
    destination: '/circle/participants/:participantId',
  },
  profileDetail: {
    source: '/tym/:profileSlug',
    destination: '/team/:profileSlug',
  },
  privacyPolicy: {
    source: '/zasady-ochrany-osobnich-udaju',
    destination: '/privacy-policy',
  },
  register: {
    source: '/registrace',
    destination: '/register',
  },
  team: {
    source: '/tym',
    destination: '/team',
  },
  termsAndConditions: {
    source: '/obchodni-podminky',
    destination: '/terms-and-conditions',
  },
  cookiesPolicy: {
    source: '/cookies-podminky',
    destination: '/cookies-policy',
  },
  codex: {
    source: '/kodex',
    destination: '/codex',
  },
  orderDetail: {
    source: '/objednavky/:orderId',
    destination: '/orders/:orderId',
  },
  signupDetail: {
    source: '/prihlasky/:signupId',
    destination: '/signups/:signupId',
  },
  circleLog: {
    source: '/druzina/denik',
    destination: '/circle/log',
  },
  status: {
    source: '/prehled',
    destination: '/status',
  },
}

const defaultLang = 'cs'

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

const reverse = (lang, name, params) => {
  const src = routes[lang || defaultLang]
  const route = src[name]
  if (!route) {
    throw new InternalServerError(`Failed to find route "${lang}:${name}"`)
  }
  return `/${lang}${translateRoute(route.source, params)}`
}

module.exports = { defaultLang, getRewrites, reverse }
