import dbConnect from '../../../../lib/dbConnect'
import Token from '../../../../models/token';

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    const token = await Token.findOne({ tokenID: args.filter.tokenID })
      .lean()
      .exec()
    return {
      ...token,
    };
  } catch (error) {
    throw error;
  }
}
