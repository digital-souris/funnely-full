import cheerio from 'cheerio'
import moment from 'moment'
import parserHelper from "./parserHelper";
import Gender from "../../database/Gender";

export default class StateHelper {
    constructor(channel, data = {}) {
        this.channel = channel
        this.data = data
    }

    async findStatesToChannel(link = this.channel.link, links = []) {
        try {
            let more, json
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                if (link === this.channel.link) {
                    json = parserHelper.getDataByBody(page.body, 'exportData":{')
                    json = JSON.parse(json)
                } else {
                    json = page.body
                }
                if (json && json.items) {
                    for (let state of json.items) {
                        links.push(await parserHelper.sortData(state))
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

    async createDataToState(link) {
        try {
            this.data.link = link
            this.data.channel = this.channel
            await this.getBodyPublication()
            await this.getDataApiPublication()
            await this.parseCounter()
            await this.parseLikes()
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getBodyPublication() {
        try {
            const page = await parserHelper.loadPage(this.data.link)
            if (page && page.statusCode === 200) {
                let json = parserHelper.getDataByBody(page.body, 'w._data = {')
                json = JSON.parse(json)
                this.data.ownerUid = json.publisher.ownerUid
                this.data.publisherId = json.publisher.id
                this.data.documentID = `native%3A${this.data.publisherId}`
                await this.parseContent(page.body, json)
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async parseCounter() {
        try {
            const href = `https://zen.yandex.ru/api/comments/top-comments?withUser=true&publisherId=${this.data.publisherId}&documentId=${this.data.documentID}&channelOwnerUid=${this.data.ownerUid}`
            console.log(href)
            const page = await parserHelper.loadPage(href)
            if (page && page.statusCode === 200) {
                let json = page.body
                this.data.likes = {
                    all: json.publicationLikeCount,
                    gender: {
                        male: 0,
                        female: 0
                    }
                }
                if (json.comments.length) {
                    for (let comment of json.comments) {
                        await this.parseComment(comment)
                    }
                }

                for (let user of json.authors) {
                    const gender = await this.parseGender(user)
                    if (gender !== undefined) {
                        if (gender) {
                            this.data.comments.gender.female++
                        } else {
                            this.data.comments.gender.male++
                        }
                    }
                }
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async parseComment(comment) {
        try {
            const link = `https://zen.yandex.ru/api/comments/child-comments/${comment.id}?publisherId=${comment.publisherId}&documentId=${comment.documentId}&channelOwnerUid=${this.data.ownerUid}`
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                let json = JSON.parse(page.body)
                this.data.comments.all += page.body.comments.length
                this.data.comments.max = Math.max(this.data.comments.max, json.comments.length)
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getDataApiPublication() {
        try {
            let publication = this.data.link.split('-')
            publication = publication[publication.length - 1]
            publication = `https://zen.yandex.ru/media-api/publication-view-stat?publicationId=${publication}`
            let page = await parserHelper.loadPage(publication)
            if (page && page.statusCode === 200) {
                let json = page.body
                this.data.comments = {
                    all: json.comments,
                    max: 0,
                    gender: {
                        male: 0,
                        female: 0
                    }
                }
                this.data.views = {
                    all: json.views,
                    toEnd: json.viewsTillEnd
                }
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async parseGender(user) {
        try {
            let name = user.firstName
            let surname = user.lastName
            if (!name) {
                name = user.name.split(' ')[0]
                surname = user.name.split(' ')[1]
            }
            let findGender = await Gender.findOne({
                $or: [
                    {name: name},
                    {surname: surname}
                ]
            })
            if (findGender) {
                return findGender.gender;
            }
            return undefined
        } catch (e) {
            console.log(e)
            return undefined
        }
    }

    async parseLikes(offset = 0) {
        try {
            const link = `https://zen.yandex.ru/api/comments/document-likers/${this.data.documentID}?offset=${offset}&limit=100&publisherId=${this.data.publisherId}&documentId=${this.data.documentID}&commentId=0&channelOwnerUid=${this.data.ownerUid}&sorting=top`
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                const json = page.body
                for (let author of json.users) {
                    let gender = await this.parseGender(author)
                    if (gender !== undefined) {
                        if (gender) {
                            this.data.likes.gender.female++
                        } else {
                            this.data.likes.gender.male++
                        }
                    }
                }
                if (json.hasMore) {
                    return await this.parseLikes(offset + 100)
                }
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async parseContent(body, json) {
        try {
            this.data.tags = []
            for (let tag of json.publication.tags) {
                this.data.tags.push(await parserHelper.findOrCreate(tag.title))
            }
            this.data.title = json.og.title
            this.data.content = {
                isPartner: 0,
                count: {}
            }
            this.data.content.image = json.og.imageUrl
            this.data.content.count = {
                image: 0,
                video: 0,
                link: 0,
                text: 0,
            }
            this.data.content.type = json.publication.content.type
            if (this.data.content.type === 'article') {
                let content = JSON.parse(json.publication.content.articleContent.contentState)
                for (let item of content.blocks) {
                    if (item.type === 'atomic:embed') {
                        this.data.content.count.video++
                    }
                    else if(item.type === 'atomic:image') {
                        this.data.content.count.image++
                    }
                    else {
                        this.data.content.count.text += item.text.length
                    }
                }
                if (Object.keys(content.entityMap).length) {
                    this.data.content.count.link = Object.keys(content.entityMap).length
                }
            }
            else if (this.data.content.type === 'gif') {
                this.data.content.count.video++
                this.data.content.count.text += json.og.description.length
            }
            this.data.publishDate = moment(json.og.publishDate).format('YYYY-MM-DD hh:mm')
            if (body.indexOf('Партнёрская публикация') !== -1) {
                this.data.content.isPartner = 1
            }
            return this.data
        }
        catch (e) {
            console.log(e)
            return undefined
        }
    }

    getNextUpdateDate() {
        if (this.channel.user) {
            return moment().add(12, 'h').format('YYYY-MM-DD hh:mm')
        }
        else {
            let now = moment().format('YYYY-MM-DD hh:mm')
            if (moment(this.data.publishDate).add(7, 'd').isAfter(now)) {
                return  moment().add(1, 'd').format('YYYY-MM-DD hh:mm')
            }
            else if(moment(this.data.publishDate).add(1, 'M').isAfter(now)) {
                return  moment().add(7, 'd').format('YYYY-MM-DD hh:mm')
            }
            else {
                return moment().add(1, 'M').format('YYYY-MM-DD hh:mm')
            }
        }
    }
}