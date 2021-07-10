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

export default cron