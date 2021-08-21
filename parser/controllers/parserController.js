import Setting from "../../database/Setting";
import cheerio from "cheerio";
import Channel from "../../database/Channel";
import parserHelper from "../helpers/parserHelper";
import channelController from "./channelController";
import State from "../../database/State";
import stateController from "./stateController";
import moment from 'moment'
import tress from 'tress'

export default {
    async findChannels(page) {
        try {
            if (!page) {
                page = await Setting.findOne({key: 'parserPage'})
                const dateNow = new Date()
                if (!page.value && dateNow.getDay() === 1) {
                    page.value = 1
                }
            }
            if (page.value) {
                const channels = await this.loadPageToChannels(page.value)
                if (channels && channels.length) {
                    for (let channel of channels) {
                        const channelInDb = await Channel.findOne({link: channel})
                        if (!channelInDb) {
                            await this.createChannelToDatabase(channel)
                        }
                    }
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
                else {
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
                'settings.parseStatus': 'parseData',
            }).sort({
                createdAt: 1
            }).limit(100)
            if (channels && channels.length) {
                for(let channel of channels) {
                    await channelController.getStatesToChannel(channel)
                }
            }
            return true
        }
        catch (e) {
            console.log(e)
        }
    },
    async  startParseChannelData() {
        try {
            const channels = await Channel.find({
                'settings.parseStatus': {
                    $in: ['new', undefined]
                },
                'isDelete': {$ne: 1},
            }).sort({
                createdAt: 1
            }).limit(1000)
            if (channels && channels.length) {
                for(let channel of channels) {
                    await channelController.getDataByChannel(channel)
                }
            }
            return true
        }
        catch (e) {
            console.log(e)
        }
    },
    async startParseStatesData() {
        try {
            const states = await State.find({publishDate: undefined}).populate('channel').limit(20000)
            if (states && states.length) {
                for (let state of states) {
                   const createState = await stateController.postCreate(state)
                    if (createState) {
                        const channel = await Channel.findOne({_id: state.channel._id})
                        if (!channel) {
                            channel.settings.lastState = createState.publishDate
                            await channel.save()
                        }
                        else if(moment(channel.settings.lastState).isBefore(createState.publishDate)) {
                            channel.settings.lastState = createState.publishDate
                            await channel.save()
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