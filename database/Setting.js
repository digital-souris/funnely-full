import mongoose from '../config/database'

const settingSchema = new mongoose.Schema({
    key: {type: String, required: true},
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    server: {
        type: Boolean,
        default: 0
    }
}, {timestamps: true})

const Setting = mongoose.model('Setting', settingSchema)

let data = [
    {
        key: 'parserPage',
        value: 0,
        server: 1
    }
]
for (let item of data) {
    Setting.findOne({key: item.key}).then(val => {
        if (!val) {
            const create = new Setting(item)
            create.save()
        }
    })
}

export default Setting