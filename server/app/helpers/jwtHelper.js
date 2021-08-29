import jwt from 'jsonwebtoken'
export default {
    sign(data, time) {
        return jwt.sign(data, process.env.JWT, {
            expiresIn: time
        })
    },
    verify(token) {
        return jwt.verify(token, process.env.JWT)
    }
}