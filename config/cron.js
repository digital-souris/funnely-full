import cron from 'node-cron'
import parserController from "../parser/controllers/parserController";
import Channel from "../database/Channel";
export default () => {
    cron.schedule('0 * * * *', async () => {
        try {
            await parserController.findChannels()
        }
        catch (e) {
            console.log(e)
        }
    })
    cron.schedule('*/10 * * * *', async () => {
        try {
            const channel = await Channel.findOne({'settings.statesCount': 0, 'settings.subscribers': 0, 'settings.auditory': 0}).sort({
                createdAt: 1
            })
            if (channel) {

            }

        }
        catch (e) {
            console.log(e)
        }
    })
}