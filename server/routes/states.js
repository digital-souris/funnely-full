import {Router} from 'express'
import statesController from "../app/controllers/statesController"

const router = Router()


router.get('/', statesController.getAllStates)

export default router