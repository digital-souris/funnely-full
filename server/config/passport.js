import passport from 'passport'
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt'
import userRepository from "../app/repository/userRepository";
import dotenv from 'dotenv'

dotenv.config()

let opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT

passport.use(new JwtStrategy(opts, async function(jwt, done) {
    try {
        let user = await userRepository.getByEmail(jwt.user)
        if (user) {
            user.password = undefined
            user.rememberToken = undefined
            return done(null, user)
        }
        return done(null, false)
    }
    catch (e) {
        console.log(e)
    }
}))

export default passport