import React from 'react'
import { NavDropdown, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useDarkMode } from 'next-dark-mode'
import { useIntl } from "react-intl"
import get from 'lodash/get'
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { defaultLocale, locales } from '../../locales';
import Routes, { Link } from '../../routes'
import pickParams from '../../utils/pickParams'

export const Header = ({ children, currentLocale, currentRoute, route, ...rest }) => {
  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })
  const defaultRouter = useRouter()
  const router = Routes.match(defaultRouter.asPath)
  const { darkModeActive, switchToDarkMode, switchToLightMode } = useDarkMode()

  // console.log('Header', {
  //   router, rest, asPath: defaultRouter.asPath
  // })

  const locale = get(router, 'route.locale') || defaultLocale
  const dropdownLocales = locales.filter(item => item !== locale)
  return (
    <Navbar collapseOnSelect expand="lg" bg={darkModeActive ? 'dark' : 'light'} variant={darkModeActive ? 'dark' : 'light'} fixed="top">
    {/* <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${darkModeActive ? 'bg-dark' : 'bg-light'}`}> */}
      <div className="container">
        <Link href={'home'} locale={locale} params={{ /*page: 1, perPage: 10, sorting: '-fee'*/ }}>
          <a className="navbar-brand">
            {darkModeActive ? (
              <img src="/static/images/logo.svg" className="img-fluid logoTop dark" alt="" />
            ) : (
              <img src="/static/images/mainlogo.svg" className="img-fluid logoTop light d-inline" alt="" />
            )}
          </a>
        </Link>

        <Navbar.Toggle aria-controls="navbarResponsive" />
        <Navbar.Collapse id="navbarResponsive">

          <ul className="navbar-nav">
            <li className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}>
              <Link href={`home`} locale={locale} params={{ /*page: 1, perPage: 10, sorting: '-fee'*/ }}>
                <a className="nav-link">
                  {f('header.pages.nodes.title')}
                  <span className="sr-only">(current)</span>
                </a>
              </Link>
            </li>
            <li className={`nav-item ${currentRoute === 'c-chain' ? 'active' : ''}`}>
              <Link href={`c-chain`} locale={locale} params={{  }}>
                <a className="nav-link">
                  {f('header.pages.c-chain.title')}
                </a>
              </Link>
            </li>
            <li className={`nav-item ${currentRoute === 'notifier' ? 'active' : ''}`}>
              <Link href={`notifier`} locale={locale} params={{  }}>
                <a className="nav-link">
                  {f('header.pages.notifier.title')}
                </a>
              </Link>
            </li>  
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item toggle-wrap" id="toggel_btn" onClick={() => {
              if (darkModeActive) {
                switchToLightMode()
              } else {
                switchToDarkMode()
              }
            }}>
              {/* <input type="checkbox" id="toggle_checkbox" /> */}
              <label htmlFor="toggle_checkbox">
                {darkModeActive ? (
                  <img src="/static/images/switch1.svg" className="night" />
                ) : (
                  <img src="/static/images/light-moon.svg" className="night-light" />
                )}
                <img src="/static/images/day.svg" className="day" />
              </label>
            </li>
          </ul>

          <NavDropdown
            as="button"
            disabled={!dropdownLocales.length}
            className="d-flex align-items-center ml-3"
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '3px',
              // boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.03)',
              border: 'none',
            }}
            title={(
              <span className="mr-2 d-flex align-items-center pt-1 pb-1">
                <img
                  src={`/static/images/icons/flag-${locale}.svg`}
                  width={16}
                  height={16}
                  className="mr-2 ml-2"
                  style={{
                    width: 'initial'
                  }}
                />
                <span className="text-uppercase mr-2">{locale}</span>
                <FaAngleDown size={16} />
              </span>
            )}
            id="nav-dropdown"
          >
            {dropdownLocales.map(l => (
              <NavDropdown.Item eventKey={l} as="button" key={l}>
                <Link
                  href={`${currentRoute}`}
                  locale={l}
                  params={{
                    ...pickParams(router.params || {}),
                  }}
                >
                  <a>
                    <span>
                      <img
                        src={`/static/images/icons/flag-${l}.svg`}
                        width={16}
                        height={16}
                        className="mr-2 ml-2"
                        style={{ width: 'initial' }}
                      />
                      <span className="text-uppercase">{l}</span>
                    </span>
                  </a>
                </Link>
              </NavDropdown.Item>
            ))}
          </NavDropdown>

        </Navbar.Collapse>

      </div>
    </Navbar>
  )
}

export default Header
