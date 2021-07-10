import cron from 'node-cron'
import parserController from "../parser/controllers/parserController";
import Channel from "../database/Channel";
import Setting from "../database/Setting";
import channelController from "../parser/controllers/channelController";

cron.schedule('0 0 * * *', async () => {
    try {
        await parserController.findChannels()
    } catch (e) {
        console.log(e)
    }
})
cron.schedule('*/10 * * * *', async () => {
    try {
        const channels = await Channel.find({
            'settings.statesCount': 0,
            'config.startParse': {$ne: 1},
            'settings.auditory': {$ne: 0},
            'isDelete': {$ne: 1}
        }).sort({
            createdAt: 1
        }).limit(250)
        if (channels && channels.length) {
            for(let channel of channels) {
                channel.config.startParse = true
                await channel.save()
                await channelController.getStatesToChannel(channel)
            }
        }
    } catch (e) {
        console.log(e)
    }
})

cron.schedule('*/10 * * * *', async () => {
    try {
        const channels = await Channel.find({
            'settings.subscribers': 0,
            'settings.auditory': 0,
            'isDelete': {$ne: 1}
        }).sort({
            createdAt: 1
        }).limit(500)
        if (channels && channels.length) {
            for(let channel of channels) {
                await channelController.getDataByChannel(channel)
            }
        }
    } catch (e) {
        console.log(e)
    }
})

export default cron