import User from '../../../database/User';
import Role from "../../../database/Role";
import Permission from "../../../database/Permission";
import bcyptHelper from "../helpers/bcyptHelper";

export default {
    findById(id) {
        return User.findOne({_id: id})
    },
    getByEmail(email) {
        return User.findOne({email: email}).populate(['role', 'permissions', 'channels'])
    },
    getByRemember(token) {
        return User.findOne({rememberToken: token})
    },
    createUser(data) {
        data.password = bcyptHelper.generateHash(data.password)
        const user = new User(data)
        return user.save()
    },
    getRoleByName(name) {
        return Role.findOne({name: name})
    }
}