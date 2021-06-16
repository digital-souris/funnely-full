import cheerio from 'cheerio'
import moment from 'moment'
import parserHelper from "./parserHelper";

export default class ChannelHelper {
    constructor(channel = null) {
        this.channel = channel
    }

    async loadZenChannelsPage(number = 1) {
        try {
            let page = await parserHelper.loadPage(`https://zen.yandex.ru/media/zen/channels?page=${number}`)
            if (page && page.statusCode === 200) {
                let channels = []
                let next = false
                const $ = cheerio.load(page.body)
                const links = $('.channel-item__link')
                for (let i = 0; i < links.length - 1; i++) {
                    let link = links.eq(i).attr('href')
                    link = `https://zen.yandex.ru${link}`
                    channels.push(link)
                }
                let nextPage = $('.pagination-prev-next__link')
                nextPage = nextPage.eq(nextPage.length - 1)
                if (nextPage.text().indexOf('Следующие') !== -1) {
                    next = true
                }
                return {channels: channels, next: next}
            }
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async setDataForCreateChannel(link) {
        try {
            let data = {}
            data.settings = {}
            data.link = link
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                const $ = cheerio.load(page.body)
                const counter = $('.desktop-channel-3-social-layout__counter-container')
                if (counter.length) {
                    for (let i = 0; i < counter.length ; i++) {
                        const counterItem = counter.eq(i)
                        const counterName = counterItem.find('.desktop-channel-3-counter__name').text()
                        let counterValue = counterItem.find('.desktop-channel-3-counter__value').text()
                        counterValue = counterValue.replace(/ /g,'')
                        if (counterName === 'subscribers') {
                            data.settings.subscribers = counterValue
                        }
                        if (counterName === 'audience') {
                            data.settings.auditory = counterValue
                        }
                    }
                }
                data.settings.lastState = await this.getDateLastState(page)
            }
            return data
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getDateLastState(page) {
        try {
            let publishDate
            const data = parserHelper.getDataByBody(page.body, 'exportData":{')
            const json = JSON.parse(data)
            if (json && json.items) {
                for (let state of json.items) {
                    const link = state.link
                    if (link) {
                        publishDate = await parserHelper.getStateDate(link)
                    }
                    if (publishDate) {
                        break
                    }
                }
            }
            return publishDate
        }
        catch (e) {
            console.log(e)
            return null
        }
    }
}