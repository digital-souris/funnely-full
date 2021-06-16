import mongoose from '../config/database'

const Schema = mongoose.Schema

const themeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Theme',
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Theme',
        }
    ]
}, { timestamps: true })

export default mongoose.model('Theme', themeSchema)