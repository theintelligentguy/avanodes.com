import dbConnect from '../../../../lib/dbConnect'
import Transaction from '../../../../models/transaction';

export default async (parent, args, context, info) => {
  await dbConnect()

  try {
    const transaction = await Transaction.findOne({ transactionID: args.filter.transactionID })
      .lean()
      .exec()
    return {
      ...transaction,
    };
  } catch (error) {
    throw error;
  }
}
