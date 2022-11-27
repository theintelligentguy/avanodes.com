import React from 'react'

import Footer from '../Footer'
import Header from '../Header'

import { defaultLocale, locales } from '../../locales';
import { Link } from '../../routes'

const Layout = ({ router = {}, currentLocale, currentRoute, children, ...rest }) => {
  const route = `home`
  return (
    <>
      <Header currentLocale={currentLocale} route={route} currentRoute={currentRoute} router={router} />
      {children || null}
      <Footer currentLocale={currentLocale} route={route} currentRoute={currentRoute} />
    </>
  )
}

export default Layout
