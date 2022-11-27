const Peer = require('../models/peer')
const { getAllValidators, getTotalStake, getValidatorsUptime } = require("./api")

const { cache } = require("./cache")

const getPreparedValidators = async () => {
  const page = 1
  const perPage = 10

  let preparedValidators = cache.get('preparedValidators');
  if (typeof preparedValidators === 'undefined') {
    const validators = await getAllValidators()
    const totalStake = await getTotalStake()
    const validatorsUptime = await getValidatorsUptime()

    const validatorsUptimeHash = validatorsUptime
      .reduce((result, current) => ({
        ...result,
        [current.nodeID]: current,
      }), {})

    const peers = await Peer
      .find()
      .lean()
      .exec()

    const peersHash = peers
      .reduce((result, current) => ({
        ...result,
        [current.nodeID]: current,
      }), {})

    preparedValidators = validators
      .map((item, index) => {
        let isPartner = false
        let isSponsored = false
        // if (index === 0) {
        //   isPartner = true
        //   isSponsored = true

        // }
        // if (index === 1) {
        //   isPartner = true
        // }
        const delegators = item.delegators || []
        const peer = peersHash[item.nodeID] || {}

        const delegatorsStaked =  delegators
          .map(delegator => delegator.stakeAmount / 1000000000)
          .reduce((result, current) => result + current, 0)
        const delegatorsTotalStaked = parseFloat(delegatorsStaked)
        const totalStacked = item.stakeAmount / 1000000000 + delegatorsTotalStaked
        const maxStaked = Math.min(3000000, (item.stakeAmount / 1000000000) * 5)
        const leftToStack = (maxStaked - totalStacked) > 0 ? (maxStaked - totalStacked) :  0
        const leftToStackPercent = 100 - (totalStacked * 100 / maxStaked)
        const stackedPercent = totalStacked * 100 / maxStaked

        const timeLeftRate = (item.endTime - Date.now() / 1000) / (item.endTime - item.startTime)
        // const timeLeftRatePercent = 100 - timeLeftRate * 100
        const delegationFeeRate = 1 - item.delegationFee / 100
        const potentialRewardPercent = (item.potentialReward * 100 / (item.stakeAmount)) * timeLeftRate * delegationFeeRate

        const networkShare = totalStacked * 100 / (totalStake / 1000000000)

        const grossRewards = delegators
          .map(delegator => delegator.potentialReward / 1000000000)
          .reduce((result, current) => result + current, 0)
        const netRewards = (grossRewards - grossRewards * item.delegationFee / 100) || 0

        // const daysLeft = moment(item.endTime * 1000).diff(moment(), 'days')
        // const hoursLeft = moment(item.endTime * 1000).diff(moment(), 'hours')
        // const minutesLeft = moment(item.endTime * 1000).diff(moment(), 'minutes')

        const itemUptime = validatorsUptimeHash[item.nodeID] || {}

        return {
          ...item,
          isPartner,
          isSponsored,
          delegators: {
            items: delegators.slice((page - 1) * perPage, page * perPage),
            itemsAll: delegators,
            pagination: {
              page,
              perPage,
              count: delegators.length
            },
            totalStaked: delegatorsTotalStaked
          },
          country_code: peer.country_code,
          country_flag: peer.country_flag ? peer.country_flag.replace('http:', 'https:') : undefined,
          latitude: peer.latitude,
          longitude: peer.longitude,
          publicIP: peer.publicIP,
          country: peer.country_name,
          city: peer.city,
          version: peer.version,
          maxYield: potentialRewardPercent,
          totalStacked,
          leftToStack,
          stackedPercent,
          leftToStackPercent,
          networkShare,
          grossRewards,
          netRewards,
          uptimePercent: itemUptime.uptime,
        }
      })
      .filter(item => item.endTime > Date.now() / 1000)

      cache.set('preparedValidators', preparedValidators)
  }
  return preparedValidators
}

module.exports = {
  getPreparedValidators: getPreparedValidators,
}
