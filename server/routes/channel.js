import {Router} from 'express'
import channelController from "../app/controllers/channelController";
import passport from '../config/passport'

const router = Router()


router.get('/', channelController.getAllChannels)
router.get('/:id', channelController.getChannelById)
router.post('/', passport.authenticate('jwt', { session: false }), channelController.addChannelToUser)
router.post('/add',passport.authenticate('jwt', { session: false }), channelController.findAndAddChannel)

export default router