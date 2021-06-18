import StateHelper from "../helpers/StateHelper";
import State from "../../database/State";
import moment from "moment";

export default {
    async saveStates(channel) {
        try {
            if (channel.link) {
                for (let state of statesLink) {
                    if (state) {
                        const find = await State.findOne({
                            link: state
                        })
                        if (!find) {
                            const data = {
                                link: state,
                                channel: channel,
                                nextUpdate: this.getNextUpdateDate(channel)
                            }
                            const createState = new State(data)
                            await createState()
                        }
                    }
                }
                return true
            }
            return false
        } catch (e) {
            console.log(e)
            return null
        }
    }
}