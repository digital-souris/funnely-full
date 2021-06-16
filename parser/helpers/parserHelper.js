import axios from "axios";
import moment from "moment";
import HttpsProxyAgent from "https-proxy-agent";
import _ from 'lodash'
import Tag from "../../database/Tag";

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
                return
            }
        }
        catch (e) {
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
        }
        catch (e) {
            console.log(e)
            return false
        }
    },
    async loadPage(link) {
        try {
            let page
            if (!this.agent) {
                page = await axios.get(link)
            }
            else {
                page = await axios.get(link, {
                    httpsAgent: this.agent
                })
            }
            page.statusCode = page.status
            page.body = page.data
            return page
        }
        catch (e) {
            if (!this.agent) {
                this.agent = new HttpsProxyAgent(_.sample(this.proxyList))
                return  this.loadPage(link)
            }
            else {
                console.log(e)
                return null
            }

        }
    },
    getDataByBody(body, first) {
        let start = body.indexOf(first)
        let open = 0
        let end = 0
        let data = ''
        for (let i = start; i < body.length - 1; i++) {
            if (i && body[i] !== undefined && typeof body[i] == "string") {
                data+=body[i]
                if (body[i] === '{') {
                    open++
                }
                if(body[i] === '}') {
                    end++
                }
                if (open === end && end !== 0) {
                    break
                }
            }
            else {
                break
            }
        }
        data = data.replace(first, '{')
        return data
    },
    async findOrCreate(name) {
        try {
            if(typeof name === "string") {
                let tag = await Tag.findOne({name: name})
                if (!tag) {
                    tag = new Tag({name: name})
                    await tag.save()
                }
                return tag
            }
            return null
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
}