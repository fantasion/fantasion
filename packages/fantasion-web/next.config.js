const { resolve } = require('path')
const { i18n } = require('./next-i18next.config.js')

module.exports = {
  reactStrictMode: true,
  i18n,
  trailingSlash: true,
  sassOptions: {
    includePaths: [resolve(__dirname, '..', '..')],
  },
}
