import Head from 'next/head'
import Routes from '../routes';

import { useIntl } from "react-intl"
import { useRouter } from 'next/router'
import get from 'lodash/get'

import Layout from '../components/Layout';
import { defaultLocale, locales } from '../locales'
import { initializeApollo, addApolloState } from '../lib/apolloClient'
import Transaction, { GET_TRANSACTION } from '../components/Transaction';
import pickParams from '../utils/pickParams';
import { defaultRouteParams } from '../constants';

export default function TransactionPage(props) {
  const defaultRouter = useRouter()
  const router = Routes.match(defaultRouter.asPath)

  const currentLocale = get(router, 'route.locale') || get(defaultRouter, 'locale', defaultLocale) || defaultLocale

  const currentRoute = get(router, 'query.nextRoute', 'node')

  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Avaxnodes - {f('page.node.title')} </title>
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
        <Transaction router={router} currentLocale={currentLocale} currentRoute={currentRoute} />
      </Layout>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const params = new URLSearchParams(`${ctx.resolvedUrl}`.split('?')[1] || '');
  const currentLocale = params.get('locale') || defaultLocale

  const router = Routes.match(ctx.resolvedUrl)

  if (!router || (router && !router.route)) {
    return {
      props: {
        currentLocale
      }
    }
  }
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_TRANSACTION,
    variables: {
      filter: pickParams({
        transactionID: get(router, 'params.id') ||  ctx.query.id,
      })
    },
  })

  return addApolloState(apolloClient, {
    props: {
      currentLocale
    },
  })
};