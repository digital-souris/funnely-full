import {Router} from 'express'

import auth from './auth'
import channels from './channel'
import states from './states'

const routes = Router()

routes.use('/auth', auth)
routes.use('/channels', channels)
routes.use('/states', states)


export default routes