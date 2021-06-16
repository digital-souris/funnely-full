import Setting from "../../database/Setting";
import ChannelHelper from '../helpers/ChannelHelper'
import Channel from "../../database/Channel";
import stateController from "./stateController";

export default {
    async findAllNewChannelsByPage(page) {
        try {
            if (!page) {
                page = await Setting.findOne({key: 'parserPage'})
                if (!page.value) {
                    page.value = 1
                }
            }
            const channelHelper = new ChannelHelper()
            const channels = await channelHelper.loadZenChannelsPage(page.value)
            if (channels) {
                for (let channel of channels.channels) {
                    let findChannel = await Channel.findOne({link: channel})
                    if (!findChannel) {
                        const createData = await channelHelper.setDataForCreateChannel(channel)
                        if (createData) {
                            const createChannel = new Channel(createData)
                            await createChannel.save()
                            if (createChannel) {
                                await stateController.saveStates(createChannel)
                            }
                        }
                    }
                }
                if (channels.next) {
                    page.value++
                    await page.save()
                } else {
                    page.value = 0
                    await page.save()
                }

                if (channels.next) {
                    await this.findAllNewChannelsByPage(page)
                } else {
                    return true
                }

            }
        } catch (e) {
            console.log(e)
            return false
        }
    }
}