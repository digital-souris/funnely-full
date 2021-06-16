import StateHelper from "../helpers/StateHelper";
import State from "../../database/State";
import trees from 'tress'

export default {
    async saveStates(channel) {
        try {
            if (channel.link) {
                const vm = this
                this.counter = 0
                this.trees = trees(async function (state, done) {
                    try {
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
                                return done(null, createState)
                            }
                            else return done('error', false)
                        }
                         else {
                            return done('error', false)
                        }
                    } catch (e) {
                        console.log(e)
                        return done(e, false)
                    }
                }, 5)
                this.trees.drain = async function () {
                    try {
                        channel.settings.statesCount += vm.counter
                        await channel.save()
                        return
                    } catch (e) {
                        console.log(e)
                        return false
                    }
                }
                this.trees.success = function (data) {
                    console.log('Job ' + this + ' successfully finished. Result is ' + data);
                    vm.counter++
                }
                this.trees.error = function (err) {
                    console.log('Job ' + this + ' failed with error ' + err);
                };
                const stateHelper = new StateHelper(channel)
                const statesLink = await stateHelper.findStatesToChannel(channel.link)
                for (let state of statesLink) {
                    if (state) {
                        const find = await State.findOne({
                            link: state
                        })
                        if (!find) {
                            this.trees.push(state)
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