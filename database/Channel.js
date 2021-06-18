import mongoose from '../config/database'
import channelHooks from "./hooks/channelHooks";

const Schema = mongoose.Schema

const channelSchema = new Schema({
    link: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'Theme',
    },
    inSearch: {
        type: Boolean,
        default: true
    },
    settings: {
        auditory: {
            type: Number,
            default: 0
        },
        statesCount: {
            type: Number,
            default: 0
        },
        subscribers: {
            type: Number,
            default: 0
        },
        lastState: {
            type: Date
        }
    },
    lastUpdate: {
        type: Date
    }
}, {timestamps: true})

channelSchema.post('save', async function () {
    await channelHooks.createChannel(this)
})

export default mongoose.model('Channel', channelSchema)