import {Router} from 'express'
import channelController from "../app/controllers/channelController";
import passport from '../config/passport'

const router = Router()


router.get('/', channelController.getAllChannels)
router.post('/', passport.authenticate('jwt', { session: false }), channelController.addChannelToUser)

export default router