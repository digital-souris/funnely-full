import StateHelper from "../helpers/StateHelper";
import State from "../../database/State";
import trees from 'tress'

export default {
    async saveStates(channel) {
        try {
            this.trees = trees(async (state, done) => {
                try {
                    const stateHelper = new StateHelper(channel)
                    let data = await stateHelper.createDataToState(state)
                    if (data.status) {
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
                            done(null, state)
                        }
                        else {
                            done('Ошибка', false)
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                    done(e, false)
                }
            }, 1)
            this.trees.drain = async function(){
                await channel.save();
                console.log('Finished');
            }
            this.trees.error = function(err) {
                console.log('Job ' + this + ' failed with error ' + err);
            };

            this.trees.success = function(data) {
                console.log('Job ' + this + ' successfully finished. Result is ' + data);
            }
            if (channel.link) {
                const stateHelper = new StateHelper(channel)
                const statesLink = await stateHelper.findStatesToChannel(channel.link)
                for (let state of statesLink) {
                    if (state) {
                        const find = await State.findOne({
                            link: state
                        })
                        if (!find) {
                            await this.trees.push(state)
                        }
                    }
                }
                await channel.save()
                return true
            }
            return false
        } catch (e) {
            console.log(e)
            return null
        }
    }
}