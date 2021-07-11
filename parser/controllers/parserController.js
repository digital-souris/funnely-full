import Setting from "../../database/Setting";
import cheerio from "cheerio";
import Channel from "../../database/Channel";
import parserHelper from "../helpers/parserHelper";
import channelController from "./channelController";
import State from "../../database/State";
import stateController from "./stateController";
import moment from 'moment'

export default {
    async findChannels(page) {
        try {
            if (!page) {
                page = await Setting.findOne({key: 'parserPage'})
                if (!page.value) {
                    page.value = 1
                }
            }
            console.log(2)
            const channels = await this.loadPageToChannels(page.value)
            console.log(3)
            console.log(channels)
            if (channels && channels.length) {
                for (let channel of channels) {
                    const channelInDb = await Channel.findOne({link: channel})
                    if (!channelInDb) {
                        await this.createChannelToDatabase(channel)
                    }
                }
                console.log(4)
                if (channels.length) {
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
            console.log(11)
            const page = await parserHelper.loadPage(`https://zen.yandex.ru/media/zen/channels?page=${number}`)
            console.log(12)
            if (page && page.status === 200) {
                let channels = []
                let next = false
                const $ = cheerio.load(page.data)
                console.log(13)
                const links = $('.channel-item__link')
                await links.each((index, item) => {
                    channels.push(`https://zen.yandex.ru${$(item).attr('href')}`)
                })
                return channels
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
    async startParseStates() {
        try {
            const channels = await Channel.find({
                'settings.statesCount': 0,
                'settings.auditory': {$ne: 0},
                'isDelete': {$ne: true}
            }).sort({
                updatedAt: -1
            }).limit(250)
            if (channels && channels.length) {
                for(let channel of channels) {
                    await channelController.getStatesToChannel(channel)
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    },
    async  startParseChannelData() {
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
        }
        catch (e) {
            console.log(e)
        }
    },
    async startParseStatesData() {
        try {
            const states = await State.find({publishDate: undefined}).populate('channel').limit(250)
            if (states && states.length) {
                for (let state of states) {
                    const createState = await stateController.postCreate(state)
                    if (createState) {
                        console.log(createState)
                        if (!state.channel.settings.lastState || moment(state.channel.settings.lastState).isBefore(createState.publishDate)) {
                            console.log(321)
                            state.channel.settings.lastState = createState.publishDate
                            await state.channel.save()
                        }
                    }
                }
            }
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
}