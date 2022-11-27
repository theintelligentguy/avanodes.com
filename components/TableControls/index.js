import { useDarkMode } from 'next-dark-mode'
import { useIntl } from "react-intl"
import { useRouter } from 'next/router'

import Routes, { Link, Router } from '../../routes'
import pickParams from '../../utils/pickParams'
import { defaultRouteParams } from '../../constants'

const maxPagesToShow = 5

const TableControls = ({
  page,
  setPage,
  perPage,
  setPerPage,
  pagination = {},
}) => {
  const defaultRouter = useRouter()
  const router = Routes.match(defaultRouter.asPath)
  const route = router.query.nextRoute
  const { darkModeActive } = useDarkMode()
  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })

  const locale = router.route.locale

  const numberOfPages = Math.ceil(pagination.count / perPage) || 0

  let startPage = page - Math.floor(maxPagesToShow / 2)
  if (startPage < 1) {
    startPage = defaultRouteParams.common.page
  }
  if (startPage > numberOfPages - maxPagesToShow && numberOfPages - maxPagesToShow > maxPagesToShow) {
    startPage = numberOfPages - maxPagesToShow
  }
  const endPage = Math.min(startPage + maxPagesToShow, numberOfPages)
  return (
    <div className="row">
      <div className="col-sm-3">
        <div className="dataTables_length bs-select" id="datatable_length">
          <label>
            {f('pagination.show')}
            {' '}
            <select
              name="datatable_length"
              aria-controls="datatable"
              className=""
              onChange={(event) => {
                Router.pushRoute(
                  route,
                  {
                    ...pickParams(router.params || {}),
                    page,
                    perPage: parseInt(event.target.value, 10) || defaultRouteParams.common.perPage,
                  },
                  locale
                )
                setPage(defaultRouteParams.common.page)
                setPerPage(parseInt(event.target.value, 10))
              }}
              value={perPage}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="-1">All</option>
            </select>
            {' '}
            {f('pagination.entries')}
          </label>
        </div>
      </div>
      <div className="col-sm-1"></div>
      <div className="col-sm-8">
        <div className="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
          <Link
            href={route}
            locale={locale}
            params={{ ...pickParams(router.params || {}), page: page - 1 || 1 }}
          >
            <a
              className={`paginate_button previous ${page === 1 ? 'disabled' : ''}`}
              aria-controls="datatable"
              data-dt-idx="0"
              tabIndex="-1"
              id="datatable_previous"
              onClick={(e) => {
                setPage(page - 1 || 1)
              }}
            >
              <div>
                {darkModeActive ? (
                  <img src="/static/images/prev.svg" className="dark-angle" />
                ) : (
                  <img src="/static/images/left-angle.svg" className="light-angle" />
                )}
              </div>
            </a>
          </Link>
          <span>
            {Array.from(Array(Math.max(endPage - startPage + 1, 1)).keys()).map(index => {
              const pageNumber = startPage + index
              return (
                <Link
                  key={`${index}-${pageNumber}`}
                  href={route}
                  locale={locale}
                  params={{ ...pickParams(router.params || {}), page: pageNumber === 1 ? 1 : pageNumber }}
                >
                  <a
                    className={`paginate_button ${page === pageNumber ? 'current' : ''}`}
                    aria-controls="datatable"
                    data-dt-idx="1"
                    tabIndex="0"
                    onClick={(e) => {
                      setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </a>
                </Link>
              )
            })}
          </span>
          <Link
            href={route}
            locale={locale}
            params={{ ...pickParams(router.params || {}), page: page + 1 > numberOfPages ? numberOfPages : page + 1 }}
          >
            <a
              className={`paginate_button next ${page === numberOfPages ? 'disabled' : ''}`}
              aria-controls="datatable"
              data-dt-idx="3"
              tabIndex="0"
              id="datatable_next"
              onClick={(e) => {
                setPage(page + 1 > numberOfPages ? numberOfPages : page + 1)
              }}
            >
              <div>
                {darkModeActive ? (
                  <img src="/static/images/next.svg" className="dark-angle" />
                ) : (
                  <img src="/static/images/right-angle.svg" className="light-angle" />
                )}
              </div>
            </a>
          </Link>
        </div>
        <div id="jump-to-page">
          <span>{f('pagination.jump.to.page')}:</span>
          <div className="dataTables_length bs-select">
            <select
              disabled={numberOfPages < 40}
              className="selectpage"
              onChange={(event) => setPage(parseInt(event.target.value, 10))}
              value={page}
            >
              <option value="3">3</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableControls
