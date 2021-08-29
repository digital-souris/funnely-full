import Channel from "../../../database/Channel";
import User from "../../../database/User";

export default {
    async addChannelToUser(req, res, next) {
        try {
            const id = req.body.id
            if (!id) {
                return res.status(404)
            }
            const channel = await Channel.findOne({_id: id})
            if (!channel && channel.user) {
                return res.status(404)
            }
            channel.user = req.user
            const user = await User.findOne({_id: req.user._id})
            user.channels.push(channel)
            await user.save()
            await channel.save()
            return res.json(channel)
        }
        catch (e) {
            return next(e)
        }
    },
    async getAllChannels(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1
            const search = req.query.search || ''
            let query, count
            if (search.length) {
                count = await Channel.countDocuments({ "name": { "$regex": search, "$options": "i" }})
                query = await Channel.find({ "name": { "$regex": search, "$options": "i" }}).skip((page - 1) * 20).limit(20).sort('-createdAt')
            }
            else {
                count = await Channel.countDocuments({name: {$ne: undefined}})
                query = await Channel.find({name: {$ne: undefined}}).skip((page - 1) * 20).limit(20).sort('-createdAt')
            }
            return res.json({query, count})

        }
        catch (e) {
            console.log(e)
        }
    }
}