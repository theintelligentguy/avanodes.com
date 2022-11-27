const Node = require('../models/node')
const Delegator = require('../models/delegator')

const { getPreparedValidators } = require('../lib/preparedValidators')

const debug = require('debug')('app:jobs:check-nodes')

const handler = agenda => async job => {
  debug()

  let preparedValidators = []
  try {
    preparedValidators = await getPreparedValidators()
  } catch (e) {
    debug(e)
  }

  debug(preparedValidators.length)

  for (const validator of preparedValidators) {
    debug(validator.nodeID, validator.delegators.itemsAll.length)

    try {
      await Node.findOneAndUpdate(
        { _id: validator.nodeID },
        {
          delegatorsCount: validator.delegators.pagination.count,
          delegatorsTotalStake: validator.delegators.totalStaked,
          txID: validator.txID,
          startTime: validator.startTime,
          endTime: validator.endTime,
          stakeAmount: validator.stakeAmount,
          potentialReward: validator.potentialReward,
          rewardOwner: validator.rewardOwner.addresses[0],
          isPartner: validator.isPartner,
          isSponsored: validator.isSponsored,
          delegationFee: validator.delegationFee,
          uptime: validator.uptime,
          connected: validator.connected,
          country_code: validator.country_code,
          latitude: validator.latitude,
          longitude: validator.longitude,
          country_flag: validator.country_flag,
          maxYield: validator.maxYield,
          totalStacked: validator.totalStacked,
          leftToStack: validator.leftToStack,
          stackedPercent: validator.stackedPercent,
          leftToStackPercent: validator.leftToStackPercent,
          networkShare: validator.networkShare,
          grossRewards: validator.grossRewards,
          netRewards: validator.netRewards,
          uptimePercent: validator.uptimePercent,
          version: validator.version,
          publicIP: validator.publicIP,
          country: validator.country,
          city: validator.city,
        },
        { upsert: true }
      )
    } catch (e) {
      debug(e)
    }

    for (const delegator of validator.delegators.itemsAll) {
      try {
        await Delegator.findOneAndUpdate(
          {
            rewardOwner: delegator.rewardOwner.addresses[0],
            nodeID: delegator.nodeID,
          },
          {
            nodeID: delegator.nodeID,
            rewardOwner: delegator.rewardOwner.addresses[0],
            txID: delegator.txID,
            startTime: delegator.startTime,
            endTime: delegator.endTime,
            stakeAmount: delegator.stakeAmount,
            potentialReward: delegator.potentialReward,
          },
          { upsert: true }
        )
      } catch (e) {
        debug(e)
      }
    }
  }
}

module.exports = {
  handler: agenda => handler(agenda),
  job: agenda => agenda.define('check nodes', handler(agenda))
}
