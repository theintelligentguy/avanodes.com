import React from 'react'
import { useIntl } from "react-intl"
import ReactClipboard from 'react-clipboardjs-copy'
import { gql, useQuery } from '@apollo/client';
import { Link, Router } from '../../routes'
import Spinner from '../Spinner'
import shortNodeId from '../../utils/shortNodeId';
import moment from 'moment'
import { FaCircle } from "react-icons/fa";

export const GET_TRANSACTION = gql`
  query GetTransaction ($filter: TransactionFilter!) {
    transaction(filter: $filter) {
        transactionID
        from
        to
        age
        avax_amount
        status
        createdAt
    }
  }
`;

export const Transaction = ({ currentLocale, router }) => {
    const { formatMessage } = useIntl()
    const f = (id, values = {}) => formatMessage({ id }, values)
    const locale = currentLocale

    const handleSetActiveTab = (event, item) => {
        event.preventDefault()
        Router.pushRoute(
            `c-chain/${item}`,
        )
    }

    const filter = {
        transactionID: router.params.id,
    }
    const { loading, data } = useQuery(GET_TRANSACTION, {
        variables: {
            filter: filter
        },
    });
    const [transactionIdCopiedToClipboard, setTransactionIdCopiedToClipboard] = React.useState(false);
    React.useEffect(() => {
        if (transactionIdCopiedToClipboard) {
            setTimeout(() => {
                setTransactionIdCopiedToClipboard(false)
            }, 1000)
        }
    }, [transactionIdCopiedToClipboard])
    const item = (data && data.transaction) || {};
    const daysLeft = item && item.age && moment(item.age * 1000).diff(moment(), 'days')
    const hoursLeft = item && item.age && moment(item.age * 1000).diff(moment(), 'hours')
    const minutesLeft = item && item.age && moment(item.age * 1000).diff(moment(), 'minutes')
    return (
        <>
            <div className="contact-wrapper">
                <div className="container">
                    <div className="row content-inner">
                        <div className="col-md-8 col-sm-6 col-lg-3">
                            <div className="nodebredcrum">
                                <Link href={`home`} locale={locale} params={{}}>
                                    <a>
                                        <img src="/static/images/home.svg" className="home-image" />
                                    </a>
                                </Link>
                                <span style={{ color: '#292932' }}> </span>

                                <Link href={`c-chain`} locale={locale} params={{}}>
                                    <a className="nodes">/ {f('header.pages.c-chain.title')}</a>
                                </Link>
                                <Link href={`c-chain/transactions`} locale={locale} params={{}}>
                                    <a className="nodes">/ {f('page.transaction.title')}</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner show={loading} />
            <div className="tab_Wrapper">
                <div className="container">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'transactions')} role="tab" aria-controls="nav-home" aria-selected="true">Transactions</a>
                            <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'blocks')} role="tab"
                                aria-controls="nav-profile" aria-selected="false">Blocks</a>
                            <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" role="tab"
                                aria-controls="nav-contact" aria-selected="false" onClick={(e) => handleSetActiveTab(e, 'tokens')}>Tokens</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="nav-home-tab">
                            <h2 id="block_detail">Transaction details</h2>
                            <div className="block_wrapper">
                                <h4 id="block_hash_wrapper">Transaction ID</h4>
                                <div className="container">
                                    <div className="row content-inner align-items-center">
                                        <div className="col-9 col-md-8 col-sm-8 removepadding-desktop">
                                            <div className="Title" onClick={e => {
                                                if (Array.from(e.target.classList).includes('pdf-image')) {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }
                                            }}>
                                                <span id="copycode">{shortNodeId(router.params.id)}</span>
                                                <ReactClipboard
                                                    text={item.transactionID}
                                                    onSuccess={() => {
                                                        setTransactionIdCopiedToClipboard(true)
                                                    }}
                                                >
                                                    <img data-clipboard-action="copy" data-clipboard-target="#copycode" src="/static/images/pdficon.svg" className="pdf-image" />
                                                </ReactClipboard>
                                                {transactionIdCopiedToClipboard && (
                                                    <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-sm-4 ">
                                            <div className="PagesubTitle">
                                                <FaCircle fill={'#5DA574'} size={10} /> &nbsp;SUCCESS
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row_wrapper">
                                    <div className="block-wrapper-inner">
                                        <div className="block-left">
                                            <div className="block">
                                                <h6>From</h6>
                                                <p className="white">{shortNodeId(item.from)}</p>
                                                <h6>To</h6>
                                                <p className="white">{shortNodeId(item.to)}</p>
                                            </div>
                                        </div>
                                        <div className="block-right">
                                            <div className="block">
                                                <h6>Amount</h6>
                                                <p className="white">{item.avax_amount} AVAX</p>
                                                <h6>Nonce</h6>
                                                <p className="white">6</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block_wrappers">
                                <div className="transaction-block-outer">
                                    <div className="transaction-block-wrapper">
                                        <div className="block_text">
                                            <h5>BLOCK</h5>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Age</h6>
                                            <p>{!!daysLeft && (<span>{daysLeft} {f('common.age.days')}</span>)}
                                                {!daysLeft && !!hoursLeft && (<span>{hoursLeft} {f('common.age.hours')}</span>)}
                                                {!daysLeft && !hoursLeft && !!minutesLeft && (<span>{minutesLeft} {f('common.age.minutes')}</span>)} – {moment(item.createdAt).format("ddd, MMM Do YYYY, h:mm:ss a")}</p>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Height</h6>
                                            <p>695 Block details »</p>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Position</h6>
                                            <p>0</p>
                                        </div>
                                    </div>
                                    <div className="transaction-block-wrapper">
                                        <div className="block_text">
                                            <h5>Transaction cost</h5>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Total burned</h6>
                                            <p> 0.068 424 95 AVAX</p>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Price</h6>
                                            <p> Price 470 NANO AVAX</p>
                                        </div>
                                        <div className="grayscalebox">
                                            <h6>Used</h6>
                                            <p> Used 145,585 GAS</p>
                                        </div>
                                        <div className="progress-bar-wrap relative">
                                            <div className="label-wrap">
                                                <label className="available-label">4.85%</label>
                                                <label className="total-label">3,000,000.00 GAS</label>
                                            </div>
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" style={{ width: '86.5%' }} aria-valuenow={36} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="internal_wrap">
                            <h1>Internal operations</h1>
                            <div className="datatable_wrapper dataTables_scroll dataTables_wrapper no-footer">
                                <div className="dataTables_scrollBody">
                                    <table id="datatable" className="display responsive nowrap dataTable" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th />
                                                <th />
                                                <th>Amount</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>ERC20 MINT</td>
                                                <td>
                                                    <div className="innercode">From: <span id="codefrom2">P-avax18ylhx…rjg0</span> <img data-clipboard-action="copy" data-clipboard-target="#codefrom2" src="/static/images/pdficon.svg" className="pdf-image" />
                                                    </div>
                                                    <div className="innercode">To: <span id="codeto2">P-avax18ylhx…rjg0</span> <img data-clipboard-action="copy" data-clipboard-target="#codeto2" src="/static/images/pdficon.svg" className="pdf-image" />
                                                    </div>
                                                </td>
                                                <td>0.00 AVAX</td>
                                                <td><FaCircle fill={'#5DA574'} size={10} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="execution-wrapper">
                            <div className="inner">
                                <h5>Execution tree <img src="/static/images/pdficon.svg" className="pdf-image" /></h5>
                            </div>
                            <div className="inner">
                                <img src="/static/images/download.svg" alt="" className="download-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transaction
