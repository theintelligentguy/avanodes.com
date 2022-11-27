import { defaultRouteParams } from '../../../../constants'
import Token from '../../../../models/token'
import dbConnect from '../../../../lib/dbConnect'

export default async (parent, args, context, info) => {
    await dbConnect()
    try {
        const page = Math.abs(args.filter.page) || defaultRouteParams.common.page
        const perPage = Math.min(Math.max(Math.abs(args.filter.perPage), 1), 100) || defaultRouteParams.common.perPage
        const count = await Token
            .countDocuments()
            .exec()
        const items = await Token
            .find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .lean()
            .exec()
        return {
            items,
            pagination: {
                page,
                perPage,
                count,
            },
        }
    } catch (error) {
        console.log('!!!!!!!!!!!', error)
        throw error;
    }
}
