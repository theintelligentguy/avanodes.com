import Stats from '../../../../models/stats'

import dbConnect from '../../../../lib/dbConnect'

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    let stats = await Stats.findOne({ key: 'stats'})
      .lean()
      .exec()

    if (!stats) {
      stats = {}
    }

    return {
      totalNodes: stats.totalNodes,
      totalTransactions: stats.totalTransactions,
      totalProviders: stats.totalProviders,
      totalDelegations: stats.totalDelegations,
      totalBlocks: stats.totalBlocks,
      totalParticipation: stats.totalParticipation,
    }
  } catch (error) {
    console.log('!!!!!!!!!!!', error)
    throw error;
  }
}
