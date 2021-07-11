import mongoose from '../config/database'
import stateHooks from "./hooks/stateHooks";

const Schema = mongoose.Schema

const stateSchema = new Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    image: String,
    type: String,
    views: {
        all: Number,
        toEnd: Number
    },
    isPartner: {
        type: Boolean,
        default: 0
    },
    content: {
        image: Number,
        video: Number,
        link: Number,
        text: Number,
        isPartner: Boolean
    },
    likes: {
        all: Number,
        gender: {
            male: Number,
            female: Number
        }
    },
    comments: {
        all: Number,
        max: Number,
        gender: {
            male: Number,
            female: Number
        }
    },
    publishDate: Date,
    nextUpdate: Date
}, { timestamps: true })


export default mongoose.model('State', stateSchema)