import {Router} from 'express'

import auth from './auth'
import channels from './channel'

const routes = Router()

routes.use('/auth', auth)
routes.use('/channels', channels)


export default routes