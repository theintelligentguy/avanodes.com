import React from 'react';
import Routes from '../routes';
import App from 'next/app'
import withDarkMode from 'next-dark-mode'
import { useDarkMode } from 'next-dark-mode'
// import appWithI18n from 'next-translate/appWithI18n'
import { useRouter } from "next/router"

// import i18nConfig from '../i18n'
import { ApolloProvider } from "@apollo/react-hooks";
import { IntlProvider } from "react-intl"
import get from 'lodash/get'

import { useApollo } from '../lib/apolloClient'

import allMessages from '../i18nLocales'
import { defaultLocale } from '../locales'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import '../styles/dd.css'
import '../styles/flags.css'
import '../styles/jquery.dataTables.min.css'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps, ...rest}) {
  const apolloClient = useApollo(pageProps)

  const { darkModeActive } = useDarkMode()

  const defaultRouter = useRouter()
  const router = Routes.match(defaultRouter.asPath)

  const locale = pageProps.currentLocale || get(router, 'route.locale') || get(defaultRouter, 'locale', defaultLocale) || defaultLocale

  const messages = allMessages[locale]

  React.useEffect(() => {
    document.querySelector("body").classList.toggle('mode-light', !darkModeActive)
  }, [darkModeActive]);

  return (
    <ApolloProvider client={apolloClient}>
      <IntlProvider
        locale={locale}
        defaultLocale={defaultLocale}
        messages={messages}
      >
        <Component {...pageProps} />
      </IntlProvider>
    </ApolloProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  return { ...await App.getInitialProps(appContext) }
}

export default withDarkMode(MyApp)
