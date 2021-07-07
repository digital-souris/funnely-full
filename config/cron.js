import cron from 'node-cron'
import parserController from "../parser/controllers/parserController";
import Channel from "../database/Channel";
import Setting from "../database/Setting";
import channelController from "../parser/controllers/channelController";

cron.schedule('0 * * * *', async () => {
    try {
        await parserController.findChannels()
    } catch (e) {
        console.log(e)
    }
})

cron.schedule('*/10 * * * *', async () => {
    try {
        const channels = await Channel.find({
            'settings.subscribers': 0,
            'settings.auditory': 0
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