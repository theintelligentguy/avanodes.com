import Head from 'next/head'
import Routes from '../routes';

import { useIntl } from "react-intl"
import { useRouter } from 'next/router'
import get from 'lodash/get'

import Notifier, { GET_NOTIFIER_STATS } from '../components/Notifier';
import Layout from '../components/Layout';
import { defaultLocale, locales } from '../locales'
import { initializeApollo, addApolloState } from '../lib/apolloClient'
import pickParams from '../utils/pickParams';

import styles from '../styles/Home.module.css'

export default function Home(props) {
  const defaultRouter = useRouter()
  const router = Routes.match(defaultRouter.asPath)

  const currentLocale = get(router, 'route.locale') || get(defaultRouter, 'locale', defaultLocale) || defaultLocale

  const currentRoute = get(router, 'query.nextRoute', 'notifier')

  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })

  return (
    <div className={styles.container}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Avaxnodes</title>
        <link rel="icon" href="/favicon.ico" />

        <link rel="canonical" href={router.parsedUrl.href} />
          {locales.map(locale => {
            const localeRoute = Routes.findAndGetUrls(router.route.name, locale, pickParams(router.params))
            return (
              <link
                key={locale}
                rel="alternate"
                hrefLang={locale}
                href={`${router.parsedUrl.origin}${localeRoute.urls.as}`}
              />
            )
          })}
      </Head>

      <Layout {...props} currentLocale={currentLocale} currentRoute={currentRoute}>
        <Notifier />
      </Layout>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const params = new URLSearchParams(`${ctx.resolvedUrl}`.split('?')[1] || '');
  const currentLocale = ctx.locale || defaultLocale

  const router = Routes.match(ctx.resolvedUrl)

  if (!router || (router && !router.route)) {
    return {
      props: {
        currentLocale
      }
    }
  }

  const apolloClient = initializeApollo()

  try {
    await apolloClient.query({
      query: GET_NOTIFIER_STATS,
    })
  } catch (e) {
    console.log(e.networkError)
  }


  return addApolloState(apolloClient, {
    props: {
      currentLocale
    },
  })
};
