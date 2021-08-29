
import State from "../../../database/State";

export default {
    async getAllStates(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1
            const search = req.query.search || ''
            let query, count
            if (search.length) {
                count = await State.countDocuments({ "title": { "$regex": search, "$options": "i" }})
                query = await State.find({ "title": { "$regex": search, "$options": "i" }}).skip((page - 1) * 20).limit(20).sort('createdAt')
            }
            else {
                count = await State.countDocuments({title: {$ne: undefined}})
                query = await State.find({title: {$ne: undefined}}).skip((page - 1) * 20).limit(20).sort('createdAt')
            }
            return res.json({query, count})

        }
        catch (e) {
            console.log(e)
        }
    }
}