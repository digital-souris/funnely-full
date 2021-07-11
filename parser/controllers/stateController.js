import StateHelper from "../helpers/StateHelper";
import moment from "moment";
import parserHelper from "../helpers/parserHelper";
import Gender from "../../database/Gender";

export default {
    async postCreate(state) {
        try {
            this.data = {
                channel: state.channel,
                link: state.link
            }
            this.helpers = {}
            await this.getDataApiPublication()
            await this.getBodyPublication()
            await this.parseCounter()
            this.data.nextUpdate = await this.getNextUpdateDate(this.data.channel)
            state = await this.generateDataToSave()
            await state.save()
            return state

        } catch (e) {
            console.log(e)
            return false
        }
    },
    async getBodyPublication() {
        try {
            const page = await parserHelper.loadPage(this.data.link)
            if (page && page.statusCode === 200) {
                let json = parserHelper.getDataByBody(page.body, 'w._data = {')
                json = JSON.parse(json)
                this.helpers.ownerUid = json.publisher.ownerUid
                this.helpers.publisherId = json.publisher.id
                await this.parseContent(page.body, json)
            } else {
                this.data.status = false
            }
            return this.data
        } catch (e) {
            this.data.status = false
            console.log(e)
            return null
        }
    },

    async parseCounter() {
        try {
            if (this.helpers.publisherId) {
                const href = `https://zen.yandex.ru/api/comments/top-comments?withUser=true&publisherId=${this.helpers.publisherId}&documentId=${this.helpers.documentID}&channelOwnerUid=${this.helpers.ownerUid}`
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
                    for (let comment of json.comments) {
                        await this.parseComment(comment)
                    }
                    /*for (let user of json.authors) {
                        const gender = await this.parseGender(user)
                        if (gender !== undefined) {
                            if (gender) {
                                this.data.comments.gender.female++
                            } else {
                                this.data.comments.gender.male++
                            }
                        }
                    }*/
                }
                return this.data
            }
        } catch (e) {
            console.log(e)
            return null
        }
    },

    async parseComment(comment) {
        try {
            const link = `https://zen.yandex.ru/api/comments/child-comments/${comment.id}?publisherId=${comment.publisherId}&documentId=${comment.documentId}&channelOwnerUid=${this.helpers.ownerUid}`
            const page = await parserHelper.loadPage(link)
            if (page && page.statusCode === 200) {
                let json = page.body
                this.data.comments.all += page.body.comments.length
                // this.data.comments.max = Math.max(this.data.comments.max, json.comments.length)
            } else {
                this.data.status = false
            }
            return this.data
        } catch (e) {
            this.data.status = false
            console.log(e)
            return null
        }
    },

    async getDataApiPublication() {
        try {

            let publication = this.data.link.split('-')
            publication = publication[publication.length - 1]
            this.helpers.documentID = `native%3A${publication}`
            publication = `https://zen.yandex.ru/media-api/publication-view-stat?publicationId=${publication}`
            let page = await parserHelper.loadPage(publication)
            if (page && page.statusCode === 200) {
                let json = page.body
                this.data.comments = {
                    all: json.comments,
                    max: 0
                }
                this.data.views = {}
                this.data.views.all = json.views
                this.data.views.toEnd = json.viewsTillEnd
            }
            return this.data
        } catch (e) {
            console.log(e)
            return null
        }
    },

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
    },

    async parseLikes(offset = 0) {
        try {
            const link = `https://zen.yandex.ru/api/comments/document-likers/${this.data.documentID}?offset=${offset}&limit=100&publisherId=${this.helpers.publisherId}&documentId=${this.helpers.documentID}&commentId=0&channelOwnerUid=${this.helpers.ownerUid}&sorting=top`
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
            } else {
                this.data.status = false
            }
            return this.data
        } catch (e) {
            this.data.status = false
            console.log(e)
            return null
        }
    },

    async parseContent(body, json) {
        try {
            this.data.tags = []
            for (let tag of json.publication.tags) {
                const findTag = await parserHelper.findOrCreate(tag.title)
                if (findTag) {
                    this.data.tags.push(findTag)
                }
            }
            this.data.title = json.og.title
            this.data.image = json.og.imageUrl
            this.data.content = {
                image: 0,
                video: 0,
                link: 0,
                text: 0,
            }
            this.data.type = json.publication.content.type
            if (this.data.type === 'article') {
                let content = JSON.parse(json.publication.content.articleContent.contentState)
                for (let item of content.blocks) {
                    if (item.type === 'atomic:embed') {
                        this.data.content.video++
                    } else if (item.type === 'atomic:image') {
                        this.data.content.image++
                    } else {
                        this.data.content.text += item.text.length
                    }
                }
                if (Object.keys(content.entityMap).length) {
                    this.data.content.link = Object.keys(content.entityMap).length
                }
            } else if (this.data.type === 'gif') {
                this.data.content.video++
                this.data.content.text += json.og.description.length
            }
            this.data.publishDate = moment(json.og.publishDate).format('YYYY-MM-DD hh:mm')
            if (body.indexOf('Партнёрская публикация') !== -1) {
                this.data.content.isPartner = 1
            }
            return this.data
        } catch (e) {
            console.log(e)
            return undefined
        }
    },

    generateDataToSave() {
        let isParser = this.data.content.isPartner
        this.data = {
            views: {
                all: this.data.all,
                toEnd: this.data.toEnd
            },
            tags: this.data.tags,
            likes: this.data.likes,
            comments: this.data.comments,
            type: this.data.content.type,
            title: this.data.title,
            image: this.data.content.image,
            content: this.data.content.count,
            publishDate: this.data.publishDate,
            nextUpdate: this.getNextUpdateDate(this.data.channel)
        }
        this.data.content.isPartner = isParser
        return this.data
    },
    getNextUpdateDate(channel) {
        if (channel.user) {
            return moment().add(12, 'h').format('YYYY-MM-DD hh:mm')
        } else {
            let now = moment().format('YYYY-MM-DD hh:mm')
            if (moment(this.data.publishDate).add(7, 'd').isAfter(now)) {
                return moment().add(1, 'd').format('YYYY-MM-DD hh:mm')
            } else if (moment(this.data.publishDate).add(1, 'M').isAfter(now)) {
                return moment().add(7, 'd').format('YYYY-MM-DD hh:mm')
            } else {
                return moment().add(1, 'M').format('YYYY-MM-DD hh:mm')
            }
        }
    }
}