import Head from 'next/head'
import Routes from '../routes';

import { useIntl } from "react-intl"
import { useRouter } from 'next/router'
import get from 'lodash/get'

import Node, { GET_NODE } from '../components/Node';
import Layout from '../components/Layout';
import { defaultLocale, locales } from '../locales'
import { initializeApollo, addApolloState } from '../lib/apolloClient'

import pickParams from '../utils/pickParams';
import { defaultRouteParams } from '../constants';

export default function NodePage(props) {
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
        <Node router={router} currentLocale={currentLocale} currentRoute={currentRoute} />
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

  // if (
  //   !get(router, 'params.page') ||
  //   get(router, 'params.page') === 'undefined' ||
  //   !get(router, 'params.perPage') ||
  //   get(router, 'params.perPage') === 'undefined' ||
  //   !get(router, 'params.sorting') ||
  //   get(router, 'params.sorting') === 'undefined'
  // ) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: router.route.getAs({
  //         id: router.params.id,
  //         page: !get(router, 'params.page') || get(router, 'params.page') === 'undefined'
  //           ? 1
  //           : +get(router, 'params.page'),
  //         perPage: !get(router, 'params.perPage') ||get(router, 'params.perPage') === 'undefined'
  //           ? 10
  //           : +get(router, 'params.perPage'),
  //         sorting: !get(router, 'params.sorting') || get(router, 'params.sorting') === 'undefined'
  //           ? '-started-on'
  //           : get(router, 'params.sorting'),
  //       })
  //     }
  //   }
  // }

  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_NODE,
    variables: {
      filter: pickParams({
        nodeID: get(router, 'params.id') ||  ctx.query.id,
        page: +get(router, 'params.page') || defaultRouteParams.common.page,
        perPage: +get(router, 'params.perPage') || defaultRouteParams.common.perPage,
        sorting: get(router, 'params.sorting') || defaultRouteParams.node.sorting,
      })
    },
  })

  return addApolloState(apolloClient, {
    props: {
      currentLocale
    },
  })
};
