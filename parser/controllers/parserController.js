import Setting from "../../database/Setting";
import cheerio from "cheerio";
import Channel from "../../database/Channel";
import parserHelper from "../helpers/parserHelper";

export default {
    async findChannels(page) {
        try {
            if (!page) {
                page = await Setting.findOne({key: 'parserPage'})
                if (!page.value) {
                    page.value = 1
                }
            }
            const channels = await this.loadPageToChannels(page.value)
            if (channels && channels.channels.length) {
                for (let channel of channels.channels) {
                    const channelInDb = await Channel.findOne({link: channel})
                    if (!channelInDb) {
                        await this.createChannelToDatabase(channel)
                    }
                }
                if (channels.next) {
                    page.value++
                    await page.save()
                    return await this.findChannels(page)
                } else {
                    page.value = 0
                    await page.save()
                    return true
                }
            }
            return false
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async loadPageToChannels(number) {
        try {
            const page = await parserHelper.loadPage(`https://zen.yandex.ru/media/zen/channels?page=${number}`)
            if (page && page.status === 200) {
                let channels = []
                let next = false
                const $ = cheerio.load(page.data)
                const links = $('.channel-item__link')
                await links.each((index, item) => {
                    channels.push(`https://zen.yandex.ru${$(item).attr('href')}`)
                })
                let nextPage = $('.pagination-prev-next__link')
                nextPage = nextPage.eq(nextPage.length - 1)
                if (nextPage.text().indexOf('Следующие') !== -1) {
                    next = true
                }
                return {channels: channels, next: next}
            }
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async createChannelToDatabase(link) {
        try {
            let data = {}
            data.settings = {
                statesCount: 0,
                subscribers: 0,
                auditory: 0
            }
            data.link = link
            const createChannel = new Channel(data)
            await createChannel.save()
            return createChannel
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async getDateLastState(page) {
        try {
            let publishDate
            const data = parserHelper.getDataByBody(page.data, 'exportData":{')
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
        } catch (e) {
            console.log(e)
            return null
        }
    }
}