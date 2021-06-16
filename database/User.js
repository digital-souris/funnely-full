import mongoose from '../config/database'
import userHooks from "../app/hooks/userHooks";

const Schema = mongoose.Schema

const userTheme = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    rememberToken: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: 0
    },
    channels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    role: {
      type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
        }
    ]
}, { timestamps: true })

userTheme.pre('save', function () {
    userHooks.generatePassword(this)
})
userTheme.post('save', async function () {
    await userHooks.sendMailAfterRegister(this)
})

export default mongoose.model('User', userTheme)