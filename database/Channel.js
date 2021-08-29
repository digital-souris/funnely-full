import mongoose from '../config/database'
import textSearch from 'mongoose-text-search'

const Schema = mongoose.Schema

const channelSchema = new Schema({
    link: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
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
    isDelete: {
        type: Boolean,
        default: false
    },
    config: {
      startParse: {
          type: Boolean,
          default: false
      }
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
        },
        parseStatus: {
            type: String,
            default: 'new'
        }
    },
    lastUpdate: {
        type: Date
    }
}, {timestamps: true})

channelSchema.plugin(textSearch);

channelSchema.index({ name: 'text' });

export default mongoose.model('Channel', channelSchema)