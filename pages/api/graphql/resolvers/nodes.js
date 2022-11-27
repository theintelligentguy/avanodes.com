import { defaultRouteParams } from '../../../../constants'
import { getSortMethod } from '../../../../lib/getSortMethod'
// import { getPreparedValidators } from '../../../../lib/preparedValidators'
import Node from '../../../../models/node'
import dbConnect from '../../../../lib/dbConnect'


const sortingMap = {
  fee: 'delegationFee',
  delegators: 'delegatorsCount',
  ['max-yield']: 'maxYield',
  ['total-stake']: 'totalStacked',
  ['free-space']: 'leftToStack',
  ['started-on']: 'startTime',
  ['time-left']: 'endTime',
  ['node-id']: '_id',
  ['country']: 'country_code',
}

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    const page = Math.abs(args.filter.page) || defaultRouteParams.common.page
    const perPage = Math.min(Math.max(Math.abs(args.filter.perPage), 1), 100) || defaultRouteParams.common.perPage

    // const preparedValidators = await getPreparedValidators()

    // let currentValidators = preparedValidators
    const filter = {
      endTime: { "$gt": parseInt(Date.now() / 1000, 10) }
    }
    if (args.filter.filter) {
      // currentValidators = currentValidators.filter(item => item.nodeID.includes(args.filter.filter))
      filter["_id"] = { "$regex": args.filter.filter, "$options": "i" }
    }
    if (args.filter.freeSpace) {
      // currentValidators = currentValidators
      //   .filter(item => {
      //     return item.leftToStackPercent > parseFloat(args.filter.freeSpace)
      //   })
      filter["leftToStackPercent"] = { "$gt": parseFloat(args.filter.freeSpace) }
    }

    // const count = currentValidators.length
    const checkSorting = `${args.filter.sorting}`
      .split(',')
      .filter((item) => !!sortingMap[`${item}`.substring(1)])
      .reduce((result, current) => result && current, true)
    const sorting = !args.filter.sorting || !checkSorting
      ? defaultRouteParams.home.sorting
      : args.filter.sorting

    // const sortedCurrentValidators = currentValidators.slice().sort(getSortMethod(sortingMap)(...sorting.split(',')))

    // const currentValidatorsPageItems = sortedCurrentValidators.slice((page - 1) * perPage, page * perPage)

    // const filter = { "_id": { "$regex": "Alex", "$options": "i" } }

    const preparedSorting = `${sorting}`.replace(/\,/ig, ' ').replace(/\+/ig, '').split(' ').map(item => {
      const result = item[0] === '-'
        ? `-${sortingMap[`${item}`.substring(1)]}`
        : sortingMap[item]
      return result
    }).join(' ')

    console.log(sorting, preparedSorting)

    const count = await Node
      .countDocuments(filter)
      .exec()
    const items = await Node
      .find(filter)
      .sort(preparedSorting)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
      .exec()

    return {
      items: items.map(i => ({
        ...i,
        nodeID: i._id,
        delegators: {
          pagination: {
            count: i.delegatorsCount,
          },
          totalStaked: i.delegatorsTotalStake,
        }
      })),
      pagination: {
        page,
        perPage,
        count,
      },
    }
  } catch (error) {
    console.log('!!!!!!!!!!!', error)
    throw error;
  }
}
