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
import numberWithCommas from '../../utils/numberWithCommas';
import numberFormat from '../../utils/numberFormat';



export const GET_BLOCK = gql`
  query GetBlock ($filter: BlockFilter!) {
    block(filter: $filter) {
        blockID
        height
        age
        createdAt
        gasUsed
        gasTotal
        transactions
        total_burned
        volume
        size
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

export const Block = ({ currentLocale, router }) => {
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
        blockID: router.params.id,
    }
    const { loading, data } = useQuery(GET_BLOCK, {
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
    const [blockHashCopiedToClipboard, setBlockHashCopiedToClipboard] = React.useState(false);
    React.useEffect(() => {
        if (blockHashCopiedToClipboard) {
            setTimeout(() => {
                setBlockHashCopiedToClipboard(false)
            }, 1000)
        }
    }, [blockHashCopiedToClipboard])
    const item = (data && data.block) || {};
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
                                <Link href={`c-chain/blocks`} locale={locale} params={{}}>
                                    <a className="nodes">/ {f('page.block.title')}</a>
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
                            <a className="nav-item nav-link active" id="nav-profile-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'blocks')} role="tab"
                                aria-controls="nav-profile" aria-selected="false">Blocks</a>
                            <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" role="tab"
                                aria-controls="nav-contact" aria-selected="false" onClick={(e) => handleSetActiveTab(e, 'tokens')}>Tokens</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="blocks" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div className="block-details-wrapper">
                                <h2 id="block-detail">Block details</h2>
                                <div className="block_wrapper">
                                    <h4 className="block-title">Block hash</h4>
                                    <div className="copy-details-wrapper" style={{ position: 'relative' }} onClick={e => {
                                        if (Array.from(e.target.classList).includes('pdf-image')) {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }
                                    }}>
                                        <span id="copycode" className="copy_wrapper">{shortNodeId(item.blockID)}</span>
                                        <ReactClipboard
                                            text={item.blockID}
                                            onSuccess={() => {
                                                setBlockHashCopiedToClipboard(true)
                                            }}
                                        >
                                            <img data-clipboard-action="copy" data-clipboard-target="#copycode" src="/static/images/pdficon.svg" className="pdf-image" />
                                        </ReactClipboard>
                                        {blockHashCopiedToClipboard && (
                                            <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                                        )}
                                    </div>
                                    <div className="block-wrapper-inner">
                                        <div className="block-left">
                                            <div className="block">
                                                <h6>Height</h6>
                                                <p className="white">{item.height}</p>
                                            </div>
                                            <div className="block">
                                                <h6>Timestamp</h6>
                                                <p className="white">{moment(item.createdAt).format("ddd, MMM Do YYYY, h:mm:ss a")}</p>
                                            </div>
                                            <div className="block">
                                                <h6>Size</h6>
                                                <p><span className="white">{item.size}</span> BYTE</p>
                                            </div>
                                        </div>
                                        <div className="block-right">
                                            <div className="block">
                                                <h6>Gas used</h6>
                                                <p><span className="white">{numberWithCommas(item.gasUsed)}</span> Gas</p>
                                                <span>{numberFormat(item.gasUsed * 100 / item.gasTotal)}% of {numberWithCommas(item.gasTotal)}</span>
                                            </div>
                                            <div className="block">
                                                <h6>Total burned</h6>
                                                <p className="white">{item.total_burned} AVAX</p>
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

export default Block
