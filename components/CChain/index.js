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
import pickParams from '../../utils/pickParams';
import numberWithCommas from '../../utils/numberWithCommas';
import numberFormat from '../../utils/numberFormat';

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
export const GET_BLOCKS = gql`
  query GetBlocks ($filter: BlocksFilter!){
    blocks(filter: $filter) {
        items {
            blockID,
            height,
            age,
            createdAt,
            gasUsed,
            gasTotal,
            transactions,
            total_burned,
            volume,
            size
        }
      pagination {
        page
        perPage
        count
      }
    }
  }
`;
export const GET_TOKENS = gql`
  query GetTokens ($filter: TokensFilter!){
    tokens(filter: $filter) {
        items {
            name,
            tokenID,
            createdAt,
            supply_amount,
            supply_unit
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
    const daysLeft = moment(item.age * 1000).diff(moment(), 'days')
    const hoursLeft = moment(item.age * 1000).diff(moment(), 'hours')
    const minutesLeft = moment(item.age * 1000).diff(moment(), 'minutes')
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
        <tr onClick={() => {
            if (!transactionIdCopiedToClipboard && !fromAddressCopiedToClipboard && !toAddressCopiedToClipboard) {
                Router.pushRoute(
                    'c-chain/transaction',
                    pickParams({
                        id: item.transactionID,
                    }),
                    locale
                )
            }
        }}>
            <td>{shortNodeId(item.transactionID)}</td>
            <td style={{ position: 'relative' }} onClick={e => {
                if (Array.from(e.target.classList).includes('pdf-image')) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}>
                <span id="code2" className="spancode">{shortNodeId(item.transactionID)}</span>
                <ReactClipboard
                    text={item.transactionID}
                    onSuccess={(e) => {
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
                        onSuccess={(e) => {
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
                        onSuccess={(e) => {
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
            <td>
                <div className="timestamp">{!!daysLeft && (<span>{daysLeft} {f('common.age.days')}</span>)}
                    {!daysLeft && !!hoursLeft && (<span>{hoursLeft} {f('common.age.hours')}</span>)}
                    {!daysLeft && !hoursLeft && !!minutesLeft && (<span>{minutesLeft} {f('common.age.minutes')}</span>)}</div>
                <div className="timestamp">{moment(item.createdAt).format("ddd, MMM Do YYYY, h:mm:ss a")}</div>
            </td>
            <td>{item.avax_amount} AVAX</td>
            <td><FaCircle fill={'#5DA574'} size={10} /></td>
        </tr>
    )
}

const BlockTableItem = ({ item, f, locale }) => {
    const daysLeft = moment(item.age * 1000).diff(moment(), 'days')
    const hoursLeft = moment(item.age * 1000).diff(moment(), 'hours')
    const minutesLeft = moment(item.age * 1000).diff(moment(), 'minutes')
    
    return (
        <tr onClick={() => {
            Router.pushRoute(
                'c-chain/block',
                pickParams({
                    id: item.blockID,
                }),
                locale
            )
        }} role="row" className="odd">
            <td>{item.height}</td>
            <td>{!!daysLeft && (<span className="white">{daysLeft} {f('common.age.days')}</span>)}
                {!daysLeft && !!hoursLeft && (<span className="white">{hoursLeft} {f('common.age.hours')}</span>)}
                {!daysLeft && !hoursLeft && !!minutesLeft && (<span className="white">{minutesLeft} {f('common.age.minutes')}</span>)}<span>&nbsp; Sun, 29 Nov 2020 15:17:20 GMT</span> </td>
            <td>1</td>
            <td><span className="white">{numberWithCommas(item.gasUsed)}:{numberFormat(item.gasUsed*100/item.gasTotal)}% of {numberWithCommas(item.gasTotal)}</span></td>
            {/* <td><span className="white">145,585:</span> 0.29% of 50,710,977</td> */}
            <td><span className="white">{item.total_burned}</span></td>
            <td>{item.volume} AVAX</td>
            <td>{item.size} BYTES</td>
        </tr>
    )
}


const TokenTableItem = ({ item, f, locale }) => {
    const [contactAddressCopiedToClipboard, setContactAddressCopiedToClipboard] = React.useState(false);
    React.useEffect(() => {
        if (contactAddressCopiedToClipboard) {
            setTimeout(() => {
                setContactAddressCopiedToClipboard(false)
            }, 1000)
        }
    }, [contactAddressCopiedToClipboard])
    return (
        <tr onClick={() => {
            if (!contactAddressCopiedToClipboard) {
                Router.pushRoute(
                    'c-chain/token',
                    pickParams({
                        id: item.tokenID,
                    }),
                    locale
                )
            }
        }} role="row" className="odd">
            <td>
                <div className="rect_wrapp">AXP</div>
            </td>
            <td>{item.name}</td>
            <td style={{ position: 'relative' }} onClick={e => {
                if (Array.from(e.target.classList).includes('pdf-image')) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}> <span id="copycode">{shortNodeId(item.tokenID)}</span>
                <ReactClipboard
                    text={item.tokenID}
                    onSuccess={(e) => {
                        setContactAddressCopiedToClipboard(true)
                    }}
                >
                    <img data-clipboard-action="copy" data-clipboard-target="#copycode" src="/static/images/pdficon.svg" className="pdf-image" />
                </ReactClipboard>
                {contactAddressCopiedToClipboard && (
                    <div className="copiedtext d-block">{f('common.copied.to.clipboard')}</div>
                )}
            </td>
            <td>{moment(item.createdAt).format("ddd, MMM Do YYYY, h:mm:ss a")}</td>
            <td>{item.supply_amount}&nbsp;{item.supply_unit}</td>
        </tr>
    )
}
export const CChain = ({ currentLocale, router }) => {
    const { formatMessage } = useIntl()
    const f = (id, values = {}) => formatMessage({ id }, values)
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(25);
    const [activeTab, setActiveTab] = React.useState('transactions')

    const locale = currentLocale
    React.useEffect(() => {
        const newTabe = getActiveTab();
        if (newTabe !== activeTab) {
            if(newTabe === ""){
                setActiveTab("transactions")
            }else{
                setActiveTab(newTabe)
            }
        }
    }, [router.params])
    const getActiveTab = () => {
        const routerName = router.route.name;
        const splittedRouter = routerName.split('/');
        return splittedRouter[1];
    }
    const { loading, error, data: transactionData } = useQuery(GET_TRANSACTIONS, {
        variables: {
            filter: {
                page,
                perPage
            }
        },
    });
    const { blockLoading, blockError, data: blockData } = useQuery(GET_BLOCKS, {
        variables: {
            filter: {
                page,
                perPage
            }
        },
    });
    const { tokenLoading, tokenError, data: tokenData } = useQuery(GET_TOKENS, {
        variables: {
            filter: {
                page,
                perPage
            }
        },
    });

    const transactionsTable = () => {
        return (
            <div className="tab-pane fade active show" id="transactions" role="tabpanel" aria-labelledby="nav-home-tab">
                <h2>C-Chain Transactions</h2>
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
                                <th>HASH</th>
                                <th> </th>
                                <th> </th>
                                <th>BLOCK AGE</th>
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
        )
    }
    const blocksTable = () => {
        return (
            <div className="tab-pane fade active show" id="blocks" role="tabpanel" aria-labelledby="nav-home-tab">
                <h2>Blocks</h2>
                <div id="block_table_wrapper" className="dataTables_wrapper dataTables_scroll">
                    <TableControls
                        locale={locale}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={blockData && blockData.blocks && blockData.blocks.pagination}
                    />
                    <table id="datatable" className="display responsive nowrap dataTable" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>HEIGHT</th>
                                <th>AGE</th>
                                <th>TRANSACTIONS</th>
                                <th>GAS USED</th>
                                <th>TOTAL BURNED</th>
                                <th>VOLUME</th>
                                <th>SIZE</th>
                            </tr>
                        </thead>
                        <tbody>

                            {blockData && blockData.blocks && blockData.blocks.items && blockData.blocks.items.map((item, index) => {
                                return (
                                    <BlockTableItem
                                        key={`${item.blockID}-${index}`}
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
                        pagination={blockData && blockData.blocks && blockData.blocks.pagination}
                    />
                </div>
            </div>
        )
    }
    const renderTokensTable = () => {
        return (
            <div className="tab-pane fade active show" id="tokens" role="tabpanel" aria-labelledby="nav-profile-tab">
                <h2>Tokens</h2>
                <div id="datatable_wrapper" className="dataTables_wrapper dataTables_scroll">
                    <TableControls
                        locale={locale}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={transactionData && transactionData.transactions && transactionData.transactions.pagination}
                    />
                    <table id="datatable" className="display responsive nowrap dataTable" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th />
                                <th>NAME</th>
                                <th>CONTRACT ADDRESS</th>
                                <th>CREATED AT</th>
                                <th>TOTAL SUPPLY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokenData && tokenData.tokens && tokenData.tokens.items && tokenData.tokens.items.map((item, index) => {
                                return (
                                    <TokenTableItem
                                        key={`${item.tokenID}-${index}`}
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
                        pagination={tokenData && tokenData.tokens && tokenData.tokens.pagination}
                    /></div>
            </div>
        )
    }
    const renderActiveTab = () => {

        switch (activeTab) {
            case 'transactions':
                return transactionsTable();
            case 'blocks':
                return blocksTable();
            case 'tokens':
                return renderTokensTable();
            default:
                return transactionsTable();
        }
    }
    const handleSetActiveTab = (event, item) => {
        event.preventDefault()
        Router.pushRoute(
            `c-chain/${item}`,
        )
        setPerPage(25);
        setPage(1);
        setActiveTab(item)
    }
    console.log('local:', locale)
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
                            <a className={`nav-item nav-link ${activeTab === 'transactions' ? 'active' : ''}`} id="nav-home-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'transactions')}
                                role="tab" aria-controls="nav-home" aria-selected="true">Transactions</a>
                            <a className={`nav-item nav-link ${activeTab === 'blocks' ? 'active' : ''}`} id="nav-profile-tab" data-toggle="tab" onClick={(e) => handleSetActiveTab(e, 'blocks')} role="tab"
                                aria-controls="nav-profile" aria-selected="false">Blocks</a>
                            <a className={`nav-item nav-link ${activeTab === 'tokens' ? 'active' : ''}`} id="nav-contact-tab" data-toggle="tab" role="tab"
                                aria-controls="nav-contact" aria-selected="false" onClick={(e) => handleSetActiveTab(e, 'tokens')}>Tokens</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CChain
