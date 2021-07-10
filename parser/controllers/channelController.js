import parserHelper from "../helpers/parserHelper";
import cheerio from "cheerio";
import moment from "moment";
import _ from 'lodash'
import Channel from "../../database/Channel";
import State from "../../database/State";

export default {
    async getDataByChannel(channel) {
        try {
            const page = await parserHelper.loadPage(channel.link)
            if (page && page.status === 200) {
                const $ = cheerio.load(page.data)
                channel.name = $('title').text()
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
            else {
                channel.isDelete = 1
                await channel.save()
            }
            return channel
        }
        catch (e) {
            console.log(e)
            return false
        }
    },
    async getStatesToChannel(channel) {
        try {
            const channels = await this.findStatesToChannel(channel.link, 0, channel)
            //await State.insertMany(channels)
            channel.lastUpdate = moment().format('YYYY-MM-DD hh:mm')
            channel.settings.statesCount = channels
            await channel.save()
            return channel
        }
        catch (e) {
            console.log(e)
            return false
        }
    },
    async findStatesToChannel(link, links = 0, channel) {
        try {
            let more, json
            const page = await parserHelper.loadPage(link)
            if (page && page.status === 200) {
                console.log(typeof page.data)
                if (!links.length && typeof page.data !== "object") {
                    json = parserHelper.getDataByBody(page.data, 'exportData":{')
                    json = JSON.parse(json)
                } else {
                    json = page.data
                }
                if (json && json.items) {
                    for (let state of json.items) {
                        const findState = await parserHelper.sortData(state)
                        if (findState) {
                            const stateInDb = await State.findOne({link: findState})
                            if (!stateInDb) {
                                const newState = new State({link:findState, channel: channel})
                                await newState.save()
                            }
                            links++
                        }
                    }
                    if (json.more && json.more.link) {
                        more = json.more.link
                    }
                }
            }
            if (more) {
                return this.findStatesToChannel(more, links, channel)
            } else {
                return links
            }
        } catch (e) {
            console.log(e)
            return links
        }
    }
}