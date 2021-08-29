import bcrypt from 'bcrypt'
export default {
    generateHash(password) {
        return bcrypt.hashSync(password, 10)
    },
    comparePassword(hash, password) {
        return bcrypt.compareSync(password, hash)
    }
}