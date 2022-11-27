import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { FaCircle } from "react-icons/fa";
import moment from 'moment'
import { useIntl } from "react-intl"
import ReactClipboard from 'react-clipboardjs-copy'
import get from 'lodash/get'

import dynamic from "next/dynamic";


import shortNodeId from '../../utils/shortNodeId';
import numberFormat from '../../utils/numberFormat';

import { defaultLocale, locales } from '../../locales';
import { Link, Router } from '../../routes'
import TableControls from '../TableControls'
import SortingIcon from '../SortingIcon'
import Spinner from '../Spinner'
import { prepareNewSorting } from '../../lib/prepareNewSorting';
import pickParams from '../../utils/pickParams';
import { defaultRouteParams } from '../../constants';


export const GET_NODE = gql`
  query GetNode ($filter: NodeFilter!) {
    node(filter: $filter) {
      nodeID
      stakeAmount
      potentialReward
      rewardOwner
      isPartner
      isSponsored
      delegationFee
      connected
      startTime
      endTime
      delegators {
        items {
          rewardOwner
          stakeAmount
          potentialReward
          startTime
          endTime
        }
        totalStaked
        pagination {
          page
          perPage
          count
        }
      }
      latitude
      longitude
      networkShare
      grossRewards
      netRewards
      uptimePercent
      leftToStackPercent
      version
      publicIP
      country
      city
    }
  }
`;

const MapWithNoSSR = dynamic(() => import("../Map"), {
  ssr: false
});

const DelegatorItem = ({ item, f }) => {
  const daysLeft = moment(item.endTime * 1000).diff(moment(), 'days')
  const hoursLeft = moment(item.endTime * 1000).diff(moment(), 'hours')
  const minutesLeft = moment(item.endTime * 1000).diff(moment(), 'minutes')

  const [nodeIdCopiedToClipboard, setNodeIdCopiedToClipboard] = React.useState(false);

  React.useEffect(() => {
    if (nodeIdCopiedToClipboard) {
      setTimeout(() => {
        setNodeIdCopiedToClipboard(false)
      }, 1000)
    }
  }, [nodeIdCopiedToClipboard])

  return (
    <tr>
      <td style={{ position: 'relative' }}>
        <span id="code1" title={item.rewardOwner}>{shortNodeId(item.rewardOwner)}</span>
        <ReactClipboard
          text={item.rewardOwner}
          onSuccess={(e) => {
            setNodeIdCopiedToClipboard(true)
          }}
        >
          <img
            data-clipboard-action="copy"
            data-clipboard-target="#code"
            src="/static/images/pdficon.svg"
            className="pdf-image"
          />
        </ReactClipboard>
        {nodeIdCopiedToClipboard && (
          <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
        )}
      </td>
      <td>{numberFormat(item.stakeAmount / 1000000000)} AVAX</td>
      <td>{numberFormat(item.potentialReward / 1000000000)} AVAX</td>
      <td>{moment(item.startTime * 1000).format('MMM D, YYYY')}</td>
      <td>
        {!!daysLeft && (<span>{daysLeft} {f('common.left.days')}</span>)}
        {!daysLeft && !!hoursLeft && (<span>{hoursLeft} {f('common.left.hours')}</span>)}
        {!daysLeft && !hoursLeft && !!minutesLeft && (<span>{minutesLeft} {f('common.left.minutes')}</span>)}
      </td>
      <td><i className="fas fa-circle"></i></td>
    </tr>
  )
}

export const Node = ({
  router,
  currentLocale,
}) => {
  const [page, setPage] = React.useState(+router.params.page || defaultRouteParams.common.page);
  const [perPage, setPerPage] = React.useState(+router.params.perPage || defaultRouteParams.common.perPage);
  const [sorting, setSorting] = React.useState(router.params.sorting || defaultRouteParams.node.sorting);

  const [nodeIdCopiedToClipboard, setNodeIdCopiedToClipboard] = React.useState(false);

  React.useEffect(() => {
    if (nodeIdCopiedToClipboard) {
      setTimeout(() => {
        setNodeIdCopiedToClipboard(false)
      }, 1000)
    }
  }, [nodeIdCopiedToClipboard])

  React.useEffect(() => {
    if (!router.params.page || router.params.page === 'undefined') {
      setPage(defaultRouteParams.common.page)
    }
    if (!router.params.perPage || router.params.perPage === 'undefined') {
      setPerPage(defaultRouteParams.common.perPage)
    }
    if (!router.params.sorting || router.params.sorting === 'undefined') {
      setSorting(defaultRouteParams.node.sorting)
    }
  }, [router.params])

  const filter = {
    nodeID: router.params.id,
    page,
    perPage,
    sorting,
  }
  const { loading, error, data } = useQuery(GET_NODE, {
    variables: {
      filter: filter
    },
  });

  const item = (data && data.node) || {delegators: {}}

  const position = React.useMemo(()=> ([
    item.latitude,
    item.longitude
  ]), [item.latitude, item.longitude, loading])

  const locale = currentLocale === defaultLocale ? undefined : currentLocale

  const delegatorsStaked = parseFloat(item.delegators.totalStaked || 0)
  const stakeAmount = item.stakeAmount / 1000000000
  const totalStacked = stakeAmount + delegatorsStaked
  const maxStaked = Math.min(3000000, (item.stakeAmount / 1000000000) * 5)
  const leftToStack = (maxStaked - totalStacked) > 0 ? (maxStaked - totalStacked) :  0
  const stackedPercent = totalStacked * 100 / maxStaked

  const ownRewards = item.potentialReward / 1000000000
  const delegatorsRewards = (item.delegators.items || [])
    .map(delegator => delegator.potentialReward / 1000000000)
    .reduce((result, current) => result + current, 0)
  const totalRewards = ownRewards + delegatorsRewards
  const ownRewardsPercent = ownRewards * 100 / totalRewards

  const timeLeftRate = (item.endTime - Date.now() / 1000) / (item.endTime - item.startTime)
  const delegationFeeRate = 1 - item.delegationFee / 100
  const potentialRewardPercent = (item.potentialReward * 100 / (item.stakeAmount)) * timeLeftRate * delegationFeeRate

  const daysTotal = moment(item.endTime * 1000).diff(moment(item.startTime * 1000), 'days')
  const daysLeft = moment(item.endTime * 1000).diff(moment(), 'days')
  const daysLeftPercent = daysLeft * 100 / daysTotal

  const { formatMessage } = useIntl()
  const f = (id, values = {}) => formatMessage({ id }, values)

  return (
    <>
      <div className="contact-wrapper">
        <div className="container">
          <div className="row content-inner">
            <div className="col-md-4 col-sm-6 col-lg-3">
              <div className="nodebredcrum">
                <Link href={`home`} locale={locale} params={{ /*page: 1, perPage: 10, sorting: '-fee'*/ }}>
                  <a
                    onClick={() => {
                      setPage(defaultRouteParams.common.page)
                      setPerPage(defaultRouteParams.common.perPage)
                      setSorting(defaultRouteParams.node.sorting)
                    }}
                  >
                    <img src="/static/images/home.svg" className="home-image" />
                  </a>
                </Link>
                <span style={{ color: '#fff' }}> / </span>
                <Link href={`home`} locale={locale} params={{ /*page: 1, perPage: 10, sorting: '-fee'*/ }}>
                  <a
                    className="nodes"
                    onClick={() => {
                      setPage(defaultRouteParams.common.page)
                      setPerPage(defaultRouteParams.common.perPage)
                      setSorting(defaultRouteParams.node.sorting)
                    }}
                  >
                    {f('page.nodes.header')}
                  </a>
                </Link>
                <span style={{ color: '#fff' }}> / </span>
                <Link href={`node`} locale={locale} params={{ id: router.params.id }}>
                  <a
                    className="nodes"
                    onClick={() => {
                      setPage(defaultRouteParams.common.page)
                      setPerPage(defaultRouteParams.common.perPage)
                      setSorting(defaultRouteParams.node.sorting)
                    }}
                  >
                    {f('page.node.header')}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Spinner show={loading} />
      <div className="progress-content">
        <div className="TitleNodeID">
          <div className="container">
            <div className="row content-inner align-items-center">
              <div className=" col-9 col-md-8 col-sm-8 col-lg-10 col-xl-10">
                <div className="Title">
                  <span title={router.params.id} className="mr-3 d-xs-inline d-sm-inline d-md-inline d-lg-none d-xl-none">{shortNodeId(router.params.id)}</span>
                  <span title={router.params.id} className="mr-3 d-none d-sm-none d-md-none d-lg-inline d-xl-inline">{router.params.id}</span>
                  <ReactClipboard
                    text={router.params.id}
                    onSuccess={(e) => {
                      setNodeIdCopiedToClipboard(true)
                    }}
                  >
                    <img
                      data-clipboard-action="copy"
                      data-clipboard-target="#copycode"
                      src="/static/images/pdficon.svg"
                      className="pdf-image"
                    />
                  </ReactClipboard>
                  {nodeIdCopiedToClipboard && (
                    <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                  )}
                </div>

              </div>
              <div className=" col-3 col-md-4 col-sm-4 col-lg-2 col-xl-2">
                {item && item.connected && (
                  <div className="PagesubTitle d-flex justify-content-end align-items-center">
                    <FaCircle fill={item.connected ? '#5DA574' : undefined} fontSize={10} />
                    <span className="ml-2">{'ACTIVE'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="main-progress-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-md-6 left-side">
                <p className="progress-title">{f('page.node.space.available')}</p>
                <div className="progress-bar-wrap relative">
                  <div className="label-wrap">
                    <label className="available-label"><strong>{numberFormat(maxStaked || 0, 0)}</strong> AVAX {f('page.node.total')}</label>
                    <label className="total-label"><strong>{numberFormat(leftToStack || 0, 0)}</strong> AVAX {f('page.node.free')}</label>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${numberFormat(item.leftToStackPercent || 0, 0)}%` }}
                      aria-valuenow={numberFormat(item.leftToStackPercent || 0, 0)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 right-side">
                <p className="progress-title">{f('page.node.time.remaining')}</p>
                <div className="progress-bar-wrap relative">
                  <div className="label-wrap">
                    <label className="available-label"><strong>{daysTotal | 0}</strong> {f('page.node.days.total')}</label>
                    <label className="total-label"><strong>{daysLeft || 0}</strong> {f('page.node.days.remaining')}</label>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${numberFormat(daysLeftPercent, 0)}%` }}
                      aria-valuenow={numberFormat(daysLeftPercent, 0)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {position[0] !== null && position[1] !== null && typeof position[0] !== 'undefined' && typeof position[1] !== 'undefined' && (
        <div className="map-content" style={{ position: 'relative', overflow: 'hidden' }}>
          <MapWithNoSSR
            position={position}
            item={item}
          />
        </div>
      )}
      <div className="box-wrapper">
        <div className="container">
          <div className="row content-inner">
            <div className="col-md-6 left">
              <div className="card-wrapper first">
                <p className="title">{f('page.node.info.title.beneficiary')}</p>
                <div className="card-content">
                  <span>{f('page.node.info.subtitle.address')}</span>
                  <p className="subtext">
                    {item && item.rewardOwner}
                  </p>
                </div>
              </div>
              <div className="card-wrapper">
                <p className="title">{f('page.node.info.title.stake')}</p>
                <div className="box-row d-flex">
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.owned')}</span>
                    <p className="subtext">{numberFormat(stakeAmount, 0)} AVAX</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.total')}</span>
                    <p className="subtext">{numberFormat(totalStacked, 0)} AVAX</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.networkShare')}</span>
                    <p className="subtext">{numberFormat(item.networkShare || 0, 6)}%</p>
                  </div>
                </div>
              </div>
              <div className="card-wrapper">
                <p className="title">{f('page.node.info.title.delegations')}</p>
                <div className="box-row d-flex">
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.maxYield')}</span>
                    <p className="subtext">{numberFormat(potentialRewardPercent, 3)} %</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.delegationsFees')}</span>
                    <p className="subtext">{numberFormat(item.delegationFee || 0, 0)}%</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.grossRewards')}</span>
                    <p className="subtext">{numberFormat(item.grossRewards || 0, 0)} AVAX</p>
                  </div>
                </div>
                <div className="box-row row-2 d-flex">
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.netRewards')}</span>
                    <p className="subtext">{numberFormat(item.netRewards || 0, 0)} AVAX</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.delegated')}</span>
                    <p className="subtext">{numberFormat(delegatorsStaked, 0)} AVAX</p>
                  </div>
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.freeSpace')}</span>
                    <p className="subtext">{numberFormat(leftToStack, 0)} AVAX</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 right">
              <div className="card-wrapper first-box-card">
                <p className="title">{f('page.node.info.title.perfomance')}</p>
                <div className="box-row d-flex">
                  <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.responses.average')}</span>
                    <p className="subtext">{item.uptimePercent ? numberFormat(Number(item.uptimePercent) * 100, 0) : 0}%</p>
                  </div>
                  {/* <div className="card-content smallbox">
                    <span>{f('page.node.info.subtitle.responses.sampled')}</span>
                    <p className="subtext">100%</p>
                  </div> */}
                </div>
                <span className="note-text">{f('page.node.info.description.perfomance')}</span>
              </div>
              <div className="card-wrapper last-box-card">
                <p className="title">{f('page.node.info.title.potentialRewards')}</p>
                <div className="card-content">
                  <span>{f('page.node.info.subtitle.fromOwnedStake')}</span>
                  <p className="subtext">{numberFormat(ownRewards, 0)} AVAX</p>
                </div>
                <div className="card-content">
                  <span>{f('page.node.info.subtitle.fromDelegations')}</span>
                  <p className="subtext">{numberFormat(delegatorsRewards, 0)} AVAX</p>
                </div>
                <div className="card-content">
                  <span>{f('page.node.info.subtitle.totalRewards')}</span>
                  <p className="subtext">{numberFormat(totalRewards, 0)} AVAX</p>
                </div>
                <div className="progress-bar-wrap relative">
                  <div className="label-wrap">
                    <label className="available-label">{f('page.node.info.subtitle.fromOwnedStake')}</label>
                    <label className="total-label">{f('page.node.info.subtitle.fromDelegations')}</label>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${numberFormat(100 - ownRewardsPercent, 0)}%` }}
                      aria-valuenow={`${numberFormat(100 - ownRewardsPercent, 0)}`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="PagetableTitle">
          <div className="container">
            <div className="">
              <div className="table-title" id="delegations">
                {f('page.node.table.header', {
                  count: get(data, 'node.delegators.pagination.count') || 0
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="contact-table node-details-wrapper">
          <div className="container">
            <div id="datatable_wrapper" className="dataTables_wrapper no-footer">
              <TableControls
                locale={locale}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={data && data.node && data.node.delegators && data.node.delegators.pagination}
              />
              <div className="row mb-3 dataTables_scroll">
                <div className="col-sm-12 dataTables_scrollHead">
                  <table
                    className="display responsive nowrap dataTable table table-hover table-responsive"
                    style={{ width: '100%' }}
                  >
                    <thead>
                      <tr>
                        <th className="sorting">
                          <Link
                            href={`node`}
                            locale={locale}
                            params={pickParams({
                              ...router.params,
                              sorting: prepareNewSorting(sorting, 'address')
                            })}
                            scroll={false}
                          >
                            <a
                              onClick={() => {
                                setSorting(prepareNewSorting(sorting, 'address'))
                              }}
                            >
                              <span>{f('page.node.table.header.beneficiary.title')}</span>
                              {' '}
                              <SortingIcon sorting={sorting} field={'address'} />
                            </a>
                          </Link>
                        </th>
                        <th className="sorting">
                          <Link
                            href={`node`}
                            locale={locale}
                            params={pickParams({
                              ...router.params,
                              sorting: prepareNewSorting(sorting, 'delegated')
                            })}
                            scroll={false}
                          >
                            <a
                              onClick={() => {
                                setSorting(prepareNewSorting(sorting, 'delegated'))
                              }}
                            >
                              <span>{f('page.node.table.header.delegated.title')}</span>
                              {' '}
                              <SortingIcon sorting={sorting} field={'delegated'} />
                            </a>
                          </Link>
                        </th>
                        <th className="sorting">
                          <Link
                            href={`node`}
                            locale={locale}
                            params={pickParams({
                              ...router.params,
                              sorting: prepareNewSorting(sorting, 'reward')
                            })}
                            scroll={false}
                          >
                            <a
                              onClick={() => {
                                setSorting(prepareNewSorting(sorting, 'reward'))
                              }}
                            >
                              <span>{f('page.node.table.header.potentialRewards.title')}</span>
                              {' '}
                              <SortingIcon sorting={sorting} field={'reward'} />
                            </a>
                          </Link>
                        </th>
                        <th className="sorting">
                          <Link
                            href={`node`}
                            locale={locale}
                            params={pickParams({
                              ...router.params,
                              sorting: prepareNewSorting(sorting, 'started-on')
                            })}
                            scroll={false}
                          >
                            <a
                              onClick={() => {
                                setSorting(prepareNewSorting(sorting, 'started-on'))
                              }}
                            >
                              <span>{f('page.node.table.header.startedon.title')}</span>
                              {' '}
                              <SortingIcon sorting={sorting} field={'started-on'} />
                            </a>
                          </Link>
                        </th>
                        <th className="sorting">
                          <Link
                            href={`node`}
                            locale={locale}
                            params={pickParams({
                              ...router.params,
                              sorting: prepareNewSorting(sorting, 'time-left')
                            })}
                            scroll={false}
                          >
                            <a
                              onClick={() => {
                                setSorting(prepareNewSorting(sorting, 'time-left'))
                              }}
                            >
                              <span>{f('page.node.table.header.timeleft.title')}</span>
                              {' '}
                              <SortingIcon sorting={sorting} field={'time-left'} />
                            </a>
                          </Link>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>

                      {item && item.delegators && item.delegators.items && item.delegators.items.map((item, index) => {
                        return (
                          <DelegatorItem
                            key={`${item.rewardOwner}-${index}`}
                            index={index}
                            item={item}
                            f={f}
                          />
                        )
                      })}

                    </tbody>
                  </table>
                </div>
              </div>
              <TableControls
                locale={locale}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={item && item.delegators && item.delegators.pagination}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Node
