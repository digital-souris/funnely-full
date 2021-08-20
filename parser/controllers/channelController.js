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
                console.log(1)
                const $ = cheerio.load(page.data)
                channel.name = $('title').text()
                const counter = $('.desktop-channel-3-social-layout__counter-container')
                if (counter.length) {
                    console.log(2)
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
                }
                else {
                    channel.settings.subscribers = 0
                    channel.settings.auditory = 0
                }
            }
            else {
                channel.isDelete = 1
            }
            channel.settings.parseStatus = 'parseData'
            await channel.save()
            return channel
        }
        catch (e) {
            console.log(e)
            return false
        }
    },
    async getStatesToChannel(channel) {
        try {
            const channels = await this.findStatesToChannel(channel.link, [], channel)
            if (channels.length) {
                await State.insertMany(channels)
                channel.lastUpdate = moment().format('YYYY-MM-DD hh:mm')
                channel.settings.statesCount = channels.length
            }
            else {
                channel.isDelete = 1
            }
            channel.settings.parseStatus = 'parseStates'
            await channel.save()
            return channel
        }
        catch (e) {
            console.log(e)
            return false
        }
    },
    async findStatesToChannel(link, links = [], channel) {
        try {
            let more = false
            let json
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
                            const stateInArray = await _.findIndex(links, (item) => {
                                return item.link === findState
                            })
                            console.log('State in Arrray ' +stateInArray)
                            if (stateInArray === -1) {
                                links.push({link:findState, channel: channel})
                            }
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