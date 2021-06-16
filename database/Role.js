import mongoose from '../config/database'

const Schema = mongoose.Schema

const userTheme = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
        }
    ]
})

const Role = mongoose.model('Role', userTheme)

const data = ['user', 'super-admin']

for (let item of data) {
    Role.findOne({name: item}).then(role => {
        if (!role) {
            const create = new Role({name: item})
            create.save()
        }
    }).catch(e => {
        console.log(e)
    })
}

export default Role