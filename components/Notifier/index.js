import { useIntl } from "react-intl"
import { gql, useQuery } from '@apollo/client';
import get from "lodash/get";

import { Link } from '../../routes'
import Spinner from '../Spinner'
import numberFormat from "../../utils/numberFormat";

export const GET_NOTIFIER_STATS = gql`
  query GetNotifierStats {
    notifierStats {
      users
      total
    }
  }
`;

export const Notifier = ({ currentLocale }) => {
  const { formatMessage } = useIntl()
  const f = (id, values = {}) => formatMessage({ id }, values)

  const locale = currentLocale

  const { loading, error, data } = useQuery(GET_NOTIFIER_STATS);

  return (
    <>
      <div className="content-wrapper">
        <div className="container">
          <div className="row content-inner">
            <div className="col-md-3 col-sm-3">
              <div className="bredcrum">
                <Link href={`home`} locale={locale} params={{ }}>
                  <a>
                    <img src="/static/images/home.svg" className="home-image" />
                  </a>
                </Link>
                <span style={{ color: '#292932' }}> </span>

                <Link href={`notifier`} locale={locale} params={{ }}>
                  <a className="nodes">/ {f('header.pages.notifier.title')}</a>
                </Link>
              </div>
            </div>

            <div className="col-sm-6">

                <a
                    className="right-text1 avax-col-notify btn"
                    href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="/static/images/bell4.svg" alt="" style={{ width: '26px' }} />
                    <div className="text_wrap">
                        <h5>{f('notifier.bot.start.button.text')}</h5>
                    </div>
                </a>


            </div>
          </div>
        </div>
      </div>

      <Spinner show={loading} />

      <div className="users_wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-3 user_wrap">
              <div className="user-text-wrap">
                <h6>{f('notifier.stats.users.prefix')}</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>{f('notifier.stats.users.value', { value: get(data, 'notifierStats.users', 0) || 0 })}</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>{f('notifier.stats.users.suffix')}</h6>
              </div>
            </div>
            <div className="col-md-3  user_wrap">
              <div className="user-text-wrap">
                <h6>{f('notifier.stats.total.prefix')}</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>${numberFormat(get(data, 'notifierStats.total', 0) || 0, 0)}</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>{f('notifier.stats.total.suffix')}</h6>
              </div>
            </div>
            {/* <div className="col-md-3  user_wrap">
              <div className="user-text-wrap">
                <h6>Trusted by</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>2 Million</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>Registered Users</h6>
              </div>
            </div>
            <div className="col-md-3 user_wrap">
              <div className="user-text-wrap">
                <h6>Tracking</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>$421,393</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>Worth of AVAX</h6>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="telegram_wrapper">
        <div className="container">
          <div className="row tel-inner-wrap">
            <div className="col-sm-12 col-md-8">
              <div className="avax-flex-wrap">

                <div id="avax-inner-flex1" className="rotate">
                  <h6>{f('notifier.logo.title')}</h6>
                </div>
                <div id="avax-inner-flex2" className="rotate"></div>
                <div id="avax-inner-flex3" className="rotate"></div>
                <div id="avax-inner-flex4" className="rotate"></div>
              </div>


              <div className="tel-text-wrap ">
                <h6>{f('notifier.logo.description')}</h6>
              </div>
              <div className="ul-list-wrap">
                <ul>
                  <li>{f('notifier.features.list.0.text')}</li>
                  <li>{f('notifier.features.list.1.text')}</li>
                  <li>{f('notifier.features.list.2.text')}</li>
                  <li>{f('notifier.features.list.3.text')}</li>
                  {/*<li>{f('notifier.features.list.4.text')}</li>
                  <li>{f('notifier.features.list.5.text')}</li>
                  <li>{f('notifier.features.list.6.text')}</li>
                  <li>{f('notifier.features.list.7.text')}</li>*/}
                </ul>
                <h6>{f('notifier.features.list.others')}</h6>
              </div>
              <a
                className="avax-col-notify btn"
                href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/static/images/bell4.svg" alt="" style={{ width: '26px' }} />
                <div className="text_wrap">
                  <h5>{f('notifier.bot.start.button.text')}</h5>
                </div>
              </a>
            </div>


            <div className="col-sm-12 col-md-4">
              <div className="mobaile-wrap ">
                <img src="/static/images/mobile-data.png" alt="" />
                {/* <ul>
                      <li id="first-li">
                        <h6>Reward of cycle 190 delivered to the delegate!</h6>
                        <span>#reward</span><span>#delegate</span>
                      </li>
                      <li>
                        <h6>Outgoing transaction of 1,232 from delegate to non-delegate is successful!</h6>
                        <h3> Current balance: 34,324,32</h3>
                        <span>#reward</span><span>#delegate</span><span>#transaction</span>
                      </li>
                      <li>
                        <h6>Reward of cycle 190 delivered to the delegate!</h6>
                        <span>#reward</span><span>#delegate</span>
                      </li>
                      <li>
                        <h6>Outgoing transaction of 1,232 from delegate to non-delegate is successful!</h6>
                        <h3> Current balance: 34,324,32</h3>
                        <span>#reward</span><span>#delegate</span><span>#transaction</span>
                      </li>
                      <li>
                        <h6>Reward of cycle 190 delivered to the delegate!</h6>
                        <span>#reward</span><span>#delegate</span>
                      </li>
                      <li id="last-li">
                        <h6>Outgoing transaction of 1,232 from delegate to non-delegate is successful!</h6>
                        <h3> Current balance: 34,324,32</h3>
                        <span>#reward</span><span>#delegate</span><span>#transaction</span>
                      </li>
                    </ul> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="users_wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-3 user_wrap">
              <div className="user-text-wrap">
                <h6>{f('notifier.stats.users.prefix')}</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>{f('notifier.stats.users.value', { value: get(data, 'notifierStats.users', 0) || 0 })}</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>{f('notifier.stats.users.suffix')}</h6>
              </div>
            </div>
            <div className="col-md-3  user_wrap">
              <div className="user-text-wrap">
                <h6>{f('notifier.stats.total.prefix')}</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>${numberFormat(get(data, 'notifierStats.total', 0) || 0, 0)}</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>{f('notifier.stats.total.suffix')}</h6>
              </div>
            </div>
            {/* <div className="col-md-3 user_wrap">
              <div className="user-text-wrap">
                <h6>Trusted by</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>2 Million</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>Registered Users</h6>
              </div>
            </div>
            <div className="col-md-3  user_wrap">
              <div className="user-text-wrap">
                <h6>Tracking</h6>
              </div>
              <div className="user-inner-wrap">
                <h3>$421,393</h3>
              </div>
              <div className="user-bottom-wrap">
                <h6>Worth of AVAX</h6>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/*<div className="bot_wrapper">
        <div className="container ">
          <div className="row row_bot_wrap">
            <div className="col-md-6">
              <div className="bot-inner-wrap">
                <h2>{f('notifier.what.can.do.title')}</h2>
                <p>
                  {f('notifier.what.can.do.description')}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="avax-inner-wrap">
                <h2>{f('notifier.where.avax.read.title')}</h2>
                <p>
                  {f('notifier.where.avax.read.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="feature_wrapper">
        <div className="container">
          <div className="feature-inner">
            <h2>{f('notifier.features.title')}</h2>
          </div>
          <div className="feature-card">
            <div className="row row-cols-md-3 flex-col ">
              <div className="col card-col">
                <div className="card card-feature">
                  <img src="/static/images/feature1.svg" className="card-img-top" alt="" style={{ width: '40px' }} />
                  <div className="card-body">
                    <h5 className="card-title">{f('notifier.features.0.title')}</h5>
                    <p className="card-text">
                      {f('notifier.features.0.description')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col card-col">
                <div className="card card-feature">
                  <img src="/static/images/Feature2.svg" className="card-img-top" alt="" style={{ width: '40px' }} />
                  <div className="card-body">
                    <h5 className="card-title">{f('notifier.features.1.title')}</h5>
                    <p className="card-text">
                      {f('notifier.features.1.description')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col card-col">
                <div className="card card-feature">
                  <img src="/static/images/feature3.svg" className="card-img-top" alt="" style={{ width: '40px' }} />
                  <div className="card-body">
                    <h5 className="card-title">{f('notifier.features.2.title')}</h5>
                    <p className="card-text">
                      {f('notifier.features.2.description')}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="button_wrapper">
        <div className="container">
          <a
            className="button-text btn"
            href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/static/images/bell1.svg" alt="" style={{ width: '26px' }} />
            <div className="text_wrap button-text_wrap">
              <h5>{f('notifier.bot.start.button.text')}</h5>
            </div>
          </a>
        </div>
      </div>*/}
    </>
  )
}

export default Notifier
