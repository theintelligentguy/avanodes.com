const { locales, defaultLocale } = require("./locales");

module.exports = {
  locales: locales,
  defaultLocale: defaultLocale,
  // pages: {
  //   "*": ["common"],
  //   "/home": ["home"],
  //   "/node": ["node"]
  // },
  // loader: false,
  // loadLocaleFrom: (locale, namespace) =>
  //   import(`./locales/${locale}/${namespace}`).then((m) => m.default),
}

// const NextI18Next = require('next-i18next').default
// // const { localeSubpaths } = require('next/config').default().publicRuntimeConfig
// const path = require('path')

// module.exports = new NextI18Next({
//   otherLanguages: locales,
//   defaultLanguage: defaultLocale,
//   // localeSubpaths,
//   localePath: path.resolve('./public/static/locales')
// })