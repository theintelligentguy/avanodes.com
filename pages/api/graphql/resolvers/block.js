import dbConnect from '../../../../lib/dbConnect'
import Block from '../../../../models/block';

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    const block = await Block.findOne({ blockID: args.filter.blockID })
      .lean()
      .exec()
    return {
      ...block,
    };
  } catch (error) {
    throw error;
  }
}
