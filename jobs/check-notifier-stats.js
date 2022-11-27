const NotifierStats = require('../models/notifierStats')
const User = require('../models/user')

const debug = require('debug')('app:jobs:check-notifier-stats')

const handler = agenda => async job => {
  debug()

  const filter = {
    active: true
  }

  const totalUsers = await User
    .countDocuments(filter)
    .exec()

  try {
    await NotifierStats.findOneAndUpdate(
      { key: 'stats' },
      {
        users: totalUsers,
      },
      { upsert: true }
    )
  } catch (e) {
    debug(e)
  }
}

module.exports = {
  handler: agenda => handler(agenda),
  job: agenda => agenda.define('check notifier stats', handler(agenda))
}
