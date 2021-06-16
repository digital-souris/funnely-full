import StateHelper from "../helpers/StateHelper";
import State from "../../database/State";

export default {
    async saveStates(channel) {
        try {
            if (channel.link) {
                const stateHelper = new StateHelper(channel)
                const statesLink = await stateHelper.findStatesToChannel()
                for (let state of statesLink) {
                    if (state) {
                        const find = await State.findOne({
                            link: state
                        })
                        if (!find) {
                            let data = await stateHelper.createDataToState(state)
                            if (data.publishDate) {
                                data.nextUpdate = stateHelper.getNextUpdateDate()
                            }
                            let obj = {
                                link: data.link,
                                views: {
                                    all: data.all,
                                    toEnd: data.toEnd
                                },
                                channel: data.channel,
                                tags: data.tags,
                                likes: data.likes,
                                comments: data.comments,
                                type: data.content.type,
                                title: data.title,
                                image: data.content.image,
                                content: data.content.count,
                                publishDate: data.publishDate,
                                nextUpdate: data.nextUpdate
                            }
                            obj.content.isPartner = data.content.isPartner
                            const createState = new State(obj)
                            await createState.save()
                            if (createState) {
                                channel.settings.statesCount++
                            }
                        }
                    }

                }
                await channel.save()
            }
        } catch (e) {
            console.log(e)
            return null
        }
    }
}