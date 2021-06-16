import mongoose from '../config/database'
import fs from 'fs'

const Schema = mongoose.Schema

const genderSchema = new Schema({
    gender: {
        type: Boolean
    },
    name: String,
    surname: String,
}, { timestamps: true })
const Gender = mongoose.model('Gender', genderSchema)



export default Gender