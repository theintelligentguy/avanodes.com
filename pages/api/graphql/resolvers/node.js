import get from 'lodash/get'
import { defaultRouteParams } from '../../../../constants'
import { getSortMethod } from '../../../../lib/getSortMethod'
import { getPreparedValidators } from '../../../../lib/preparedValidators'
import dbConnect from '../../../../lib/dbConnect'

import Node from '../../../../models/node'
import Delegator from '../../../../models/delegator'

const sortingMap = {
  address: 'rewardOwner',
  delegated: 'stakeAmount',
  reward: 'potentialReward',
  ['started-on']: 'startTime',
  ['time-left']: 'endTime',
}

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    // const validators = await getPreparedValidators()

    // const node = validators
    //   .find(item => item.nodeID === args.filter.nodeID)

    const node = await Node.findOne({ _id: args.filter.nodeID })
      .lean()
      .exec()

    // const delegators = get(node, 'delegators.itemsAll') || []

    const checkSorting = `${args.filter.sorting}`
      .split(',')
      .filter((item) => !!sortingMap[`${item}`.substring(1)])
      .reduce((result, current) => result && current, true)
    const sorting = !args.filter.sorting || !checkSorting
      ? defaultRouteParams.home.sorting
      : args.filter.sorting

    const preparedSorting = `${sorting}`.replace(/\,/ig, ' ').replace(/\+/ig, '').split(' ').map(item => {
      const result = item[0] === '-'
        ? `-${sortingMap[`${item}`.substring(1)]}`
        : sortingMap[item]
      return result
    }).join(' ')

    console.log(sorting, preparedSorting)

    // const sortedCurrentValidators = delegators.slice().sort(getSortMethod(sortingMap)(...sorting.split(',')))

    const page = Math.abs(args.filter.page) || defaultRouteParams.common.page
    const perPage = Math.min(Math.max(Math.abs(args.filter.perPage), 1), 100) || defaultRouteParams.common.perPage

    const delegators = await Delegator
      .find({
        nodeID: args.filter.nodeID
      })
      .sort(preparedSorting)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
      .exec()

    return {
      ...node,
      delegators: {
        ...node.delegators,
        // items: sortedCurrentValidators.slice((page - 1) * perPage, page * perPage),
        items: delegators,
        pagination: {
          // ...node.delegators.pagination,
          count: node.delegatorsCount,
          page,
          perPage,
        },
        totalStaked: node.delegatorsTotalStake,
      },
    };
  } catch (error) {
    throw error;
  }
}
