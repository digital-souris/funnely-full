import stateController from "../../parser/controllers/stateController";
import moment from "moment";
import parserHelper from "../../parser/helpers/parserHelper";
import State from "../State";
export default {
    async createChannel(channel) {
        try {
            if (!channel.lastUpdate) {
                channel.lastUpdate = moment().format('YYYY-MM-DD hh:mm')
                await channel.save()
                const linksArr = await this.findStatesToChannel(channel.link, [])
                for (let state of linksArr) {
                    if (state) {
                        const find = await State.findOne({
                            link: state
                        })
                        if (!find) {
                            const data = {
                                link: state,
                                channel: channel
                            }
                            const createState = new State(data)
                            createState.save()
                            channel.settings.statesCount++
                            await channel.save()
                        }
                    }
                }
                return true
            }
        }
        catch (e) {
            console.log(e)
        }
    },
    async findStatesToChannel(link, links = []) {
        try {
            let more, json
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                if (!links.length) {
                    json = parserHelper.getDataByBody(page.body, 'exportData":{')
                    json = JSON.parse(json)
                } else {
                    json = page.body
                }
                if (json && json.items) {
                    for (let state of json.items) {
                        const findState = await parserHelper.sortData(state)
                        console.log(findState)
                        if (findState) {
                            links.push(findState)
                        }
                    }
                    if (json.more && json.more.link) {
                        more = json.more.link
                    }
                }
            }
            if (more) {
                return this.findStatesToChannel(more, links)
            } else {
                return links
            }
        } catch (e) {
            console.log(e)
            return links
        }
    }

}