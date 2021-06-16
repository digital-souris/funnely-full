import mongoose from '../config/database'

const Schema = mongoose.Schema

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

export default mongoose.model('Tag', tagSchema)