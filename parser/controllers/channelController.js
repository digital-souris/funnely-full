import parserHelper from "../helpers/parserHelper";
import cheerio from "cheerio";

export default {
    async getDataByChannel(channel) {
        try {
            const page = await parserHelper.loadPage(channel.link)
            if (page && page.status === 200) {
                const $ = cheerio.load(page.data)
                const counter = $('.desktop-channel-3-social-layout__counter-container')
                if (counter.length) {
                    for (let i = 0; i < counter.length ; i++) {
                        const counterItem = counter.eq(i)
                        const counterName = counterItem.find('.desktop-channel-3-counter__name').text()
                        let counterValue = counterItem.find('.desktop-channel-3-counter__value').text()
                        counterValue = counterValue.replace(/ /g,'')
                        if (counterName === 'subscribers') {
                            channel.settings.subscribers = counterValue
                        }
                        if (counterName === 'audience') {
                            channel.settings.auditory = counterValue
                        }
                    }
                    await channel.save()
                }
            }
            return channel
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
}