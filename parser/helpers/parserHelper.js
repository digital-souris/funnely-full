import axios from "axios";
import moment from "moment";
import axiosRetry from 'axios-retry'
import _ from 'lodash'
import Tag from "../../database/Tag";

axiosRetry(axios, { retries: 8 })

export default {
    proxyList: [
        'http://b6d6a2cbc4:6a5b466c0f@45.151.144.4:44303'
    ],
    async getStateDate(link) {
        try {
            const load = await this.loadPage(link)
            if (load.statusCode === 200) {
                const content = this.getDataByBody(load.body, 'w._data = {')
                if (content && content.length) {
                    const contentJson = JSON.parse(content)
                    return moment(contentJson.og.publishDate).format('YYYY-MM-DD hh:mm')
                }
                return false
            }
        } catch (e) {
            console.log(e)
            return null
        }
    },
    async sortData(data) {
        try {
            let item = false
            let link = data['rawItem'] || data['share_link']
            if (link) {
                link = link['share_link'] || link
                if (link && typeof link === "string" && link.indexOf('zen.yandex.ru/media') !== -1) {
                    item = link
                }
            }
            return item
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async loadPage(link, error = false) {
        try {
            let page = undefined
            console.log(111)
            console.log(link)
            page = await axios.get(link, {
                timeout: 2000
            })
            console.log(112)
            return page
        } catch (e) {
            if (!error) {
                return await this.loadPage(link, true)
            }
            /*if (!this.agent) {
                this.agent = new HttpsProxyAgent(_.sample(this.proxyList))
                return  this.loadPage(link)
            }*/
            //else {
            console.log(e)
            return null
            //}
        }
    },
    getDataByBody(body, first) {
        let start = body.indexOf(first)
        let open = 0
        let end = 0
        let data = ''
        for (let i = start; i < body.length - 1; i++) {
            if (i && body[i] !== undefined && typeof body[i] == "string") {
                data += body[i]
                if (body[i] === '{') {
                    open++
                }
                if (body[i] === '}') {
                    end++
                }
                if (open === end && end !== 0) {
                    break
                }
            } else {
                break
            }
        }
        data = data.replace(first, '{')
        return data
    },
    async findOrCreate(name) {
        try {
            if (typeof name === "string") {
                let tag = await Tag.findOne({name: name})
                if (!tag) {
                    tag = new Tag({name: name})
                    await tag.save()
                    if (!tag) {
                        return false
                    }
                }
                return tag
            }
            return false
        } catch (e) {
            console.log(e)
            return false
        }
    },
}