const Stats = require('../models/stats')
const Node = require('../models/node')

const {
  getCurrentSupply,
  getLastBlockHeight,
  getTotalStake,
  getTransactionsCount,
} = require('../lib/api')

const debug = require('debug')('app:jobs:check-stats')

const handler = agenda => async job => {
  debug()

  const filter = {
    endTime: { "$gt": parseInt(Date.now() / 1000, 10) }
  }

  const totalNodes = await Node
    .countDocuments(filter)
    .exec()

  const totalDelegationsDoc = await Node
    .aggregate([
      { $match: filter },
      { $group: { _id: null, delegatorsCount: { $sum: "$delegatorsCount" } } }
    ])
    .exec()

  debug(totalNodes, totalDelegationsDoc)

  let totalBlocks = 0
  try {
    totalBlocks = await getLastBlockHeight()
  } catch (e) {
    debug(e)
  }

  let currentSupply = 0
  try {
    currentSupply = await getCurrentSupply()
  } catch (e) {
    debug(e)
  }

  let totalStake = 0
  try {
    totalStake = await getTotalStake()
  } catch (e) {
    debug(e)
  }

  let transactionsCount = 0
  try {
    transactionsCount = await getTransactionsCount()
  } catch (e) {
    debug(e)
  }

  const totalParticipation = ((totalStake / 1000000000) / (currentSupply / 1000000000)) * 100

  try {
    await Stats.findOneAndUpdate(
      { key: 'stats' },
      {
        totalNodes: totalNodes,
        totalTransactions: transactionsCount,
        totalProviders: 0,
        totalDelegations: totalDelegationsDoc[0].delegatorsCount,
        totalBlocks: totalBlocks,
        totalParticipation: totalParticipation,
      },
      { upsert: true }
    )
  } catch (e) {
    debug(e)
  }
}

module.exports = {
  handler: agenda => handler(agenda),
  job: agenda => agenda.define('check stats', handler(agenda))
}
