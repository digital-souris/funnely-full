import {Router} from 'express'
import authContoller from "../app/controllers/authContoller";
import passport from '../config/passport'

const router = Router()


router.get('/csrf', function (req,res,next) {
    return res.json({ csrfToken: req.csrfToken() })
})
router.get('/user', passport.authenticate('jwt', { session: false }) , function (req, res,next) {
    console.log(req.user)
    return res.json({user:req.user})
})
router.post('/login', authContoller.login)
router.post('/register', authContoller.register)
router.get('/remember', authContoller.remember)
router.post('/reset', authContoller.reset)
router.post('/verify', authContoller.verify)

export default router