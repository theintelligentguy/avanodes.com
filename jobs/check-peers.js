const Peer = require('../models/peer')
const axios = require('axios')

const IPS_PER_JOB = 50

const getPeers = async () => {
  const payload = {
    "jsonrpc": "2.0",
    "method": "info.peers",
    "id": 1,
  }

  let peers
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const fixture = require('../lib/api/fixtures/info.peers.json')
    peers = {
      data: fixture,
    }
  } else {
    peers = await axios.post(`https://api.avax.network/ext/info?method=info.peers`, payload)
  }

  const allItems = peers.data.result.peers

  return allItems
}

const debug = require('debug')('app:jobs:check-peers')

const handler = agenda => async job => {
  debug()

  const peers = await getPeers()

  const storedPeers = await Peer
    .find({
      $or: [
        { latitude: { $exists: false } },
        { longitude: { $exists: false } },
      ]
    })
    .lean()
    .exec();

  const storedPeersHash = storedPeers
    .reduce((result, current) => ({
      ...result,
      [current.nodeID]: current,
    }), {})

  for (const peer of peers) {
    if (!storedPeersHash[peer.nodeID]) {
      await Peer.findOneAndUpdate(
        { nodeID: peer.nodeID },
        {
          ip: peer.ip,
          publicIP: peer.publicIP,
          nodeID: peer.nodeID,
          version: peer.version,
          lastSent: peer.lastSent,
          lastReceived: peer.lastReceived,
        },
        { upsert: true }
      )

      await agenda.schedule(
        new Date(Date.now() + (peers.indexOf(peer) * 1000 + 2000)),
        'check peer ips',
        {
          nodeID: peer.nodeID,
          publicIP: peer.publicIP,
        }
      );
    }
  }
}

module.exports = {
  handler: agenda => handler(agenda),
  job: agenda => agenda.define('check peers', handler(agenda))
}
