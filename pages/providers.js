import Head from 'next/head'

import { useRouter } from 'next/router'

import Providers from '../components/Providers';
import Layout from '../components/Layout';
import { defaultLocale, locales } from '../locales'

import styles from '../styles/Home.module.css'

export default function Home(props) {
  const router = useRouter()

  const currentLocale = ((router || {}).query || {}).locale || defaultLocale
  const currentRoute = `${((router || {}).route || 'home').replace('/', '')}`

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
        <Providers />
      </Layout>
    </div>
  )
}
