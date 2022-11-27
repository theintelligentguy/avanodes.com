const { setup } = require('axios-cache-adapter')

// Create `axios-cache-adapter` instance
const api = setup({
  cache: {
    maxAge: 5 * 60 * 1000,
    key: req => req.url,
    exclude: {
      // Only exclude PUT, PATCH and DELETE methods from cache
      methods: ['put', 'patch', 'delete'],
      query: false,

    },
    debug: false,
  },
})

const getAllValidators = async () => {
  const payload = {
    "jsonrpc": "2.0",
    "method": "platform.getCurrentValidators",
    "params": {
      "subnetID": "11111111111111111111111111111111LpoYY"
    },
    "id": 1
  }

  let validators
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const fixture = require('./fixtures/platform.getCurrentValidators.json')
    validators = {
      data: fixture,
    }
  } else {
    validators = await api.post(`https://api.avax.network/ext/P?method=platform.getCurrentValidators`, payload, {
      cache: {
        key: "platform.getCurrentValidators"
      }
    })
  }

  const allItems = validators.data.result.validators

  return allItems
}

const getLastBlockHeight = async () => {
  const payload = {
    "jsonrpc": "2.0",
    "method": "platform.getHeight",
    "params": {},
    "id": 1
  }

  let result
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const fixture = require('./fixtures/platform.getHeight.json')
    result = {
      data: fixture,
    }
  } else {
    result = await api.post(`https://api.avax.network/ext/P?method=platform.getHeight`, payload, {
      cache: {
        key: "platform.getHeight"
      }
    })
  }

  const blockHeight = result.data.result.height

  return blockHeight
}

const getCurrentSupply = async () => {
  const payload = {
    "jsonrpc": "2.0",
    "method": "platform.getCurrentSupply",
    "params": {},
    "id": 1
  }

  let result
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const fixture = require('./fixtures/platform.getCurrentSupply.json')
    result = {
      data: fixture,
    }
  } else {
    result = await api.post(`https://api.avax.network/ext/P?method=platform.getCurrentSupply`, payload, {
      cache: {
        key: "platform.getCurrentSupply"
      }
    })
  }

  const supply = result.data.result.supply

  return supply
}

const getTotalStake = async () => {
  const payload = {
    "jsonrpc": "2.0",
    "method": "platform.getTotalStake",
    "params": {},
    "id": 1
  }

  let result
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const fixture = require('./fixtures/platform.getTotalStake.json')
    result = {
      data: fixture,
    }
  } else {
    result = await api.post(`https://api.avax.network/ext/P?method=platform.getTotalStake`, payload, {
      cache: {
        key: "platform.getTotalStake"
      }
    })
  }

  const stake = result.data.result.stake

  return stake
}

const getTransactionsCount = async () => {
  const payload = {
    "operationName": null,
    "variables": {},
    "query":"{\n  transactions {\n    count\n  }\n}\n"
  }

  const result = await api.post(`https://graphql.avascan.info/`, payload, {
    cache: {
      key: "graphql.getTransactionsCount"
    }
  })

  const count = result.data.data.transactions.count

  return count
}

const getValidatorsUptime = async () => {
  const result = await api.get(`https://avax.dev/data/validators.json`, {
    cache: {
      key: "getValidatorsUptime"
    }
  })

  const validators = result.data.validators

  return validators
}

module.exports = {
  getValidatorsUptime: getValidatorsUptime,
  getTransactionsCount: getTransactionsCount,
  getTotalStake: getTotalStake,
  getCurrentSupply: getCurrentSupply,
  getLastBlockHeight: getLastBlockHeight,
  getAllValidators: getAllValidators,
}
