import React from 'react'
import { useIntl } from "react-intl"

import { defaultLocale, locales } from '../../locales';
import { Link } from '../../routes'

export const Footer = ({ children }) => {
  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })
  return (
    <div className="footer">
      <div className="container">
        <div className="wrap">
          <div className="left">
            <div className="copyright ">
              Copyright © 2020 Avaxnodes
            </div>
          </div>
          <div className="right">
            <a href="https://t.me/avaxnodes" target="_blank"><button type="button" className="btn btn-secondary join-us">{f('footer.join.us.telegram')}</button></a>
            {/*<ul className="social-icon">
              <li><a href="#"><img src="/static/images/instagram.png" alt="" className="footer-dark" />
                <img src="/static/images/light-instagram.png" alt="" className="footer-light" style={{ display: 'none' }} /></a></li>
              <li><a href="#"><img src="/static/images/twitter.png" alt="" className="footer-dark" />
                <img src="/static/images/light-twitter.png" alt="" className="footer-light" style={{ display: 'none' }} /></a></li>
              <li><a href="#"><img src="/static/images/linkedin.svg" alt="" className="footer-dark" /><img src="/static/images/light-linked.svg" alt="" className="footer-light" style={{ display: 'none' }} /></a></li>
            </ul>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
