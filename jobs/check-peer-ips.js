const Peer = require('../models/peer')
const axios = require('axios')

const getIpInfo = async (ip) => {
  const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`)

  const result = response.data

  return result
}

const debug = require('debug')('app:jobs:check-peer-ips')

const handler = async job => {
  debug()

  const data = job.attrs.data;

  debug(data)

  if (!data || !data.nodeID || !data.publicIP) {
    return
  }

  const peer = await Peer.findOne({
    nodeID: data.nodeID,
  })

  debug(peer.nodeID)
  if (peer.latitude) {
    return
  }

  const ipData = await getIpInfo(data.publicIP.split(':')[0])

  debug(ipData)

  await Peer.findOneAndUpdate({
    nodeID: data.nodeID,
  }, {
    country_code: ipData.country_code,
    country_name: ipData.country_name,
    city: ipData.city,
    latitude: ipData.latitude,
    longitude: ipData.longitude,
    country_flag: ipData.location.country_flag,
  }, {
    upsert: false
  })
}

module.exports = {
  handler,
  job: agenda => agenda.define('check peer ips', handler)
}
