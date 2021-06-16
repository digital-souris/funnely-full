import mongoose from '../config/database'

const Schema = mongoose.Schema

const userTheme = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
})

export default mongoose.model('Permission', userTheme)