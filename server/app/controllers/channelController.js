import Channel from "../../../database/Channel";
import User from "../../../database/User";
import axios from 'axios'
import State from "../../../database/State";

export default {
    async findAndAddChannel(req, res, next) {
        try {
            const user = await User.findOne({_id: req.user._id})
            const link = req.body.link
            if (link.indexOf('zen.yandex') === -1) {
                return res.status(403).json({
                    message: 'Ошибка. Ссылка не относится к Zen'
                })
            }
            const findChannel = await Channel.findOne({link: link})
            if (findChannel) {
                if(!findChannel.user) {
                    user.channels.push(findChannel)
                    await user.save()
                    findChannel.user = user
                    findChannel.save()
                    return res.json(findChannel)
                }
                else {
                    return res.status(403).json({
                        message: 'Данный канал уже привязан к пользователю'
                    })

            }
        }
            else {
                const resp = await axios.get(link)
                if (resp.status === 200) {
                    let data = {}
                    data.settings = {
                        statesCount: 0,
                        subscribers: 0,
                        auditory: 0
                    }
                    data.link = link
                    data.user = user
                    data.priority = 1
                    const createChannel = new Channel(data)
                    await createChannel.save()
                    return res.json(createChannel)
                }
            }
        }
        catch (e) {
            return next(e)
        }
    },
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
                query = await Channel.find({ "name": { "$regex": search, "$options": "i" }}).skip((page - 1) * 20).limit(20).sort('createdAt')
            }
            else {
                count = await Channel.countDocuments({name: {$ne: undefined}})
                query = await Channel.find({name: {$ne: undefined}}).skip((page - 1) * 20).limit(20).sort('createdAt')
            }
            return res.json({query, count})

        }
        catch (e) {
            return next(e)
        }
    },
    async getChannelById(req, res, next) {
        try {
            const id = req.params.id
            const channel = await Channel.findOne({_id: id})
            if (!channel) {
                return res.status(404)
            }
            const states = await State.find({channel: channel._id})
            return res.json({
                channel: channel,
                states: states
            })
        }
        catch (e) {
            return next(e)
        }
    }
}