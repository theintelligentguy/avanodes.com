import React from 'react'
import { useIntl } from "react-intl"
import ReactClipboard from 'react-clipboardjs-copy'
import { gql, useQuery } from '@apollo/client';
import TableControls from '../TableControls'
import { Link, Router } from '../../routes'
import Spinner from '../Spinner'
import shortNodeId from '../../utils/shortNodeId';
import moment from 'moment'
import { FaCircle } from "react-icons/fa";

export const GET_TOKEN = gql`
  query GetToken ($filter: TokenFilter!) {
    token(filter: $filter) {
        name
        tokenID
        createdAt
        supply_amount
        supply_unit
    }
  }
`;



export const GET_TRANSACTIONS = gql`
  query GetTransactions ($filter: TransactionsFilter!){
    transactions(filter: $filter) {
      items {
        transactionID,
        from,
        to,
        age,
        avax_amount,
        status,
        createdAt
      }
      pagination {
        page
        perPage
        count
      }
    }
  }
`;


const TransactionTableItem = ({ item, f, locale }) => {
    const [transactionIdCopiedToClipboard, setTransactionIdCopiedToClipboard] = React.useState(false);
    const [fromAddressCopiedToClipboard, setFromAddressCopiedToClipboard] = React.useState(false);
    const [toAddressCopiedToClipboard, setToAddressCopiedToClipboard] = React.useState(false);
    React.useEffect(() => {
        if (transactionIdCopiedToClipboard) {
            setTimeout(() => {
                setTransactionIdCopiedToClipboard(false)
            }, 1000)
        }
        if (fromAddressCopiedToClipboard) {
            setTimeout(() => {
                setFromAddressCopiedToClipboard(false)
            }, 1000)
        }
        if (toAddressCopiedToClipboard) {
            setTimeout(() => {
                setToAddressCopiedToClipboard(false)
            }, 1000)
        }
    }, [transactionIdCopiedToClipboard,
        fromAddressCopiedToClipboard,
        toAddressCopiedToClipboard
    ])
    return (
        <tr>
            <td className = "detail">ERC20 MINT</td>
            <td style={{ position: 'relative' }} onClick={e => {
                if (Array.from(e.target.classList).includes('pdf-image')) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}>
                <span id="code2" className="spancode">{shortNodeId(item.transactionID)}</span>
                <ReactClipboard
                    text={item.transactionID}
                    onSuccess={() => {
                        setTransactionIdCopiedToClipboard(true)
                    }}
                >
                    <img
                        data-clipboard-action="copy" data-clipboard-target="#code2"
                        src="/static/images/pdficon.svg" className="pdf-image" />
                </ReactClipboard>
                {transactionIdCopiedToClipboard && (
                    <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                )}
            </td>
            <td style={{ position: 'relative' }} onClick={e => {
                if (Array.from(e.target.classList).includes('pdf-image')) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}>
                <div className="innercode">From: <span id="codefrom1">{shortNodeId(item.from)}</span>
                    <ReactClipboard
                        text={item.from}
                        onSuccess={() => {
                            setFromAddressCopiedToClipboard(true)
                        }}
                    >
                        <img
                            data-clipboard-action="copy" data-clipboard-target="#codefrom1"
                            src="/static/images/pdficon.svg" className="pdf-image" />
                    </ReactClipboard>
                    {fromAddressCopiedToClipboard && (
                        <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                    )}
                </div>

                <div className="innercode">To: <span id="codeto1">{shortNodeId(item.to)}</span>
                    <ReactClipboard
                        text={item.to}
                        onSuccess={() => {
                            setToAddressCopiedToClipboard(true)
                        }}
                    >
                        <img
                            data-clipboard-action="copy" data-clipboard-target="#codeto1"
                            src="/static/images/pdficon.svg" className="pdf-image" />
                    </ReactClipboard>
                    {toAddressCopiedToClipboard && (
                        <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                    )}
                </div>
            </td>
            <td>{item.avax_amount} AVAX</td>
            <td><FaCircle fill={'#5DA574'} size={10} /></td>
        </tr>
    )
}

export const Token = ({ currentLocale, router }) => {
    const { formatMessage } = useIntl()
    const f = (id, values = {}) => formatMessage({ id }, values)
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(25);
    const [activeTab, setActiveTab] = React.useState('transactions')

    const locale = currentLocale

    const handleSetActiveTab = (event, item) => {
        event.preventDefault()
        Router.pushRoute(
            `c-chain/${item}`,
        )
    }

    const filter = {
        tokenID: router.params.id,
    }
    const { loading, error, data } = useQuery(GET_TOKEN, {
        variables: {
            filter: filter
        },
    });
    const { data: transactionData } = useQuery(GET_TRANSACTIONS, {
        variables: {
            filter: {
                page,
                perPage
            }
        },
    });
    const [tokenIdCopiedToClipboard, setTokenIdCopiedToClipboard] = React.useState(false);
    React.useEffect(() => {
        if (tokenIdCopiedToClipboard) {
            setTimeout(() => {
                setTokenIdCopiedToClipboard(false)
            }, 1000)
        }
    }, [tokenIdCopiedToClipboard])
    const item = (data && data.token) || {};
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
                                <Link href={`c-chain/tokens`} locale={locale} params={{}}>
                                    <a className="nodes">/ {f('page.token.title')}</a>
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
                            <a className="nav-item nav-link" id="nav-home-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'transactions')} role="tab" aria-controls="nav-home" aria-selected="true">Transactions</a>
                            <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'blocks')} role="tab"
                                aria-controls="nav-profile" aria-selected="false">Blocks</a>
                            <a className="nav-item nav-link active" id="nav-contact-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'tokens')} role="tab"
                                aria-controls="nav-contact" aria-selected="false" >Tokens</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="tokens" role="tabpanel" aria-labelledby="nav-contact-tab">
                            <div className="block-details-wrapper">
                                <h2 id="block-detail">Token details</h2>
                                <div className="block_wrapper">
                                    <h4 className="block-title">Token ID</h4>
                                    <div className="copy-details-wrapper" style={{ position: 'relative' }} onClick={e => {
                                        if (Array.from(e.target.classList).includes('pdf-image')) {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }
                                    }}>
                                        <span id="copycode" className="copy_wrapper">{shortNodeId(item.tokenID)}</span>
                                        <ReactClipboard
                                            text={item.tokenID}
                                            onSuccess={(e) => {
                                                setTokenIdCopiedToClipboard(true)
                                            }}
                                        >
                                            <img data-clipboard-action="copy" data-clipboard-target="#copycode" src="/static/images/pdficon.svg" className="pdf-image" />
                                        </ReactClipboard>
                                        {tokenIdCopiedToClipboard && (
                                            <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                                        )}
                                    </div>
                                    <div className="block-wrapper-inner">
                                        <div className="block-left">
                                            <div className="block">
                                                <h6>Standard</h6>
                                                <p className="white">Avalanche</p>
                                            </div>
                                            <div className="block">
                                                <h6>Name</h6>
                                                <p className="white">{item.name}</p>
                                            </div>
                                            <div className="block">
                                                <h6>Symbol</h6>
                                                <p className="white">AXP</p>
                                            </div>
                                        </div>
                                        <div className="block-right">
                                            <div className="block">
                                                <h6>Total Supply</h6>
                                                <p className="white">{item.supply_amount} {item.supply_unit}</p>
                                            </div>
                                            <div className="block">
                                                <h6>Decimals</h6>
                                                <p className="white">18</p>
                                            </div>
                                            <div className="block">
                                                <h6>Holders</h6>
                                                <p className="white">2</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="datatable_wrapper" className="dataTables_wrapper dataTables_scroll">
                                        <TableControls
                                            locale={locale}
                                            page={page}
                                            setPage={setPage}
                                            perPage={perPage}
                                            setPerPage={setPerPage}
                                            pagination={transactionData && transactionData.transactions && transactionData.transactions.pagination}
                                        />
                                        <table id="datatable" className="display responsive nowrap transactions dataTable" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>HASH</th>
                                                    <th> </th>
                                                    <th>AMOUNT</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactionData && transactionData.transactions && transactionData.transactions.items && transactionData.transactions.items.map((item, index) => {
                                                    return (
                                                        <TransactionTableItem
                                                            key={`${item.transactionID}-${index}`}
                                                            item={item}
                                                            index={index}
                                                            locale={locale}
                                                            f={f}
                                                        />
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <TableControls
                                            locale={locale}
                                            page={page}
                                            setPage={setPage}
                                            perPage={perPage}
                                            setPerPage={setPerPage}
                                            pagination={transactionData && transactionData.transactions && transactionData.transactions.pagination}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Token
