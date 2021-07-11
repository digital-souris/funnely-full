import StateHelper from "../helpers/StateHelper";
import moment from "moment";
import parserHelper from "../helpers/parserHelper";
import Gender from "../../database/Gender";

export default {
    state: {},
    async postCreate(state) {
        try {
            this.state = state
            this.helpers = {}
            await this.getDataApiPublication()
            await this.getBodyPublication()
            await this.parseCounter()
            this.state.nextUpdate = await this.getNextUpdateDate(this.state.channel)
            //state = await this.generateDataToSave()
            await this.state.save()
            return this.state

        } catch (e) {
            console.log(e)
            return false
        }
    },
    async getBodyPublication() {
        try {
            const page = await parserHelper.loadPage(this.state.link)
            if (page && page.status === 200) {
                let json = parserHelper.getDataByBody(page.data, 'w._data = {')
                json = JSON.parse(json)
                this.helpers.ownerUid = json.publisher.ownerUid
                this.helpers.publisherId = json.publisher.id
                await this.parseContent(page.body, json)
                return true
            } else {
                return false
            }
        } catch (e) {
            this.state.status = false
            console.log(e)
            return null
        }
    },

    async parseCounter() {
        try {
            if (this.helpers.publisherId) {
                const href = `https://zen.yandex.ru/api/comments/top-comments?withUser=true&publisherId=${this.helpers.publisherId}&documentId=${this.helpers.documentID}&channelOwnerUid=${this.helpers.ownerUid}`
                const page = await parserHelper.loadPage(href)
                if (page && page.status === 200) {
                    let json = page.data
                    this.state.likes = {
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
                                this.state.comments.gender.female++
                            } else {
                                this.state.comments.gender.male++
                            }
                        }
                    }*/
                }
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
            if (page && page.status === 200) {
                let json = page.data
                this.state.comments.all += page.body.comments.length
                // this.state.comments.max = Math.max(this.state.comments.max, json.comments.length)
            } else {
                this.state.status = false
            }
            return true
        } catch (e) {
            console.log(e)
            return null
        }
    },

    async getDataApiPublication() {
        try {
            let publication = this.state.link.split('-')
            publication = publication[publication.length - 1]
            this.helpers.documentID = `native%3A${publication}`
            publication = `https://zen.yandex.ru/media-api/publication-view-stat?publicationId=${publication}`
            console.log(publication)
            let page = await parserHelper.loadPage(publication)
            if (page && page.status === 200) {
                let json = page.data
                this.state.comments = {
                    all: json.comments,
                    max: 0
                }
                this.state.views = {}
                this.state.views.all = json.views
                this.state.views.toEnd = json.viewsTillEnd
            }
            return true
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
            const link = `https://zen.yandex.ru/api/comments/document-likers/${this.state.documentID}?offset=${offset}&limit=100&publisherId=${this.helpers.publisherId}&documentId=${this.helpers.documentID}&commentId=0&channelOwnerUid=${this.helpers.ownerUid}&sorting=top`
            const page = await parserHelper.loadPage(link)
            if (page && page.status === 200) {
                const json = page.data
                for (let author of json.users) {
                    let gender = await this.parseGender(author)
                    if (gender !== undefined) {
                        if (gender) {
                            this.state.likes.gender.female++
                        } else {
                            this.state.likes.gender.male++
                        }
                    }
                }
                if (json.hasMore) {
                    return await this.parseLikes(offset + 100)
                }
            }
            return true
        } catch (e) {
            console.log(e)
            return null
        }
    },

    async parseContent(body, json) {
        try {
            this.state.tags = []
            for (let tag of json.publication.tags) {
                const findTag = await parserHelper.findOrCreate(tag.title)
                if (findTag) {
                    this.state.tags.push(findTag)
                }
            }
            this.state.title = json.og.title
            this.state.image = json.og.imageUrl
            this.state.content = {
                image: 0,
                video: 0,
                link: 0,
                text: 0,
            }
            this.state.type = json.publication.content.type
            if (this.state.type === 'article') {
                let content = JSON.parse(json.publication.content.articleContent.contentState)
                for (let item of content.blocks) {
                    if (item.type === 'atomic:embed') {
                        this.state.content.video++
                    } else if (item.type === 'atomic:image') {
                        this.state.content.image++
                    } else {
                        this.state.content.text += item.text.length
                    }
                }
                if (Object.keys(content.entityMap).length) {
                    this.state.content.link = Object.keys(content.entityMap).length
                }
            } else if (this.state.type === 'gif') {
                this.state.content.video++
                this.state.content.text += json.og.description.length
            }
            this.state.publishDate = moment(json.og.publishDate).format('YYYY-MM-DD hh:mm')
            if (body && typeof body === 'string' && body.indexOf('Партнёрская публикация') !== -1) {
                this.state.content.isPartner = 1
            }
            return true
        } catch (e) {
            console.log(e)
            return undefined
        }
    },

    generateDataToSave() {
        console.log(this.state)
        //let isParser = this.state.content.isPartner
        this.state = {
            views: {
                all: this.state.all,
                toEnd: this.state.toEnd
            },
            tags: this.state.tags,
            likes: this.state.likes,
            comments: this.state.comments,
            type: this.state.content.type,
            title: this.state.title,
            image: this.state.content.image,
            content: this.state.content.count,
            publishDate: this.state.publishDate,
            nextUpdate: this.getNextUpdateDate(this.state.channel)
        }
        this.state.content.isPartner = isParser
        return this.state
    },
    getNextUpdateDate(channel) {
        if (channel.user) {
            return moment().add(12, 'h').format('YYYY-MM-DD hh:mm')
        } else {
            let now = moment().format('YYYY-MM-DD hh:mm')
            if (moment(this.state.publishDate).add(7, 'd').isAfter(now)) {
                return moment().add(1, 'd').format('YYYY-MM-DD hh:mm')
            } else if (moment(this.state.publishDate).add(1, 'M').isAfter(now)) {
                return moment().add(7, 'd').format('YYYY-MM-DD hh:mm')
            } else {
                return moment().add(1, 'M').format('YYYY-MM-DD hh:mm')
            }
        }
    }
}