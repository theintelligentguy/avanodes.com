import NotifierStats from '../../../../models/notifierStats'

import dbConnect from '../../../../lib/dbConnect'

export default async (parent, args, context, info) => {
  await dbConnect()

  let stats = await NotifierStats.findOne({ key: 'stats'})
    .lean()
    .exec()

  if (!stats) {
    stats = {}
  }

  try {
    const result = await Promise.resolve({
      users: stats.users,
      total: 41393,
    })
    return result
  } catch (error) {
    console.log('!!!!!!!!!!!', error)
    throw error;
  }
}
