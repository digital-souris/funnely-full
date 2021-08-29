import userRepository from "../repository/userRepository";
import bcyptHelper from "../helpers/bcyptHelper";
import jwtHelper from "../helpers/jwtHelper";
import mailController from "./mailController";

export default {
    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await userRepository.getByEmail(email)
            if (!user) {
                return res.status(403).json({message: 'Пользователь не найден'})
            }
            console.log(user.password, password)
            if (!bcyptHelper.comparePassword(user.password, password)) {
                return res.status(401).json({message: 'Неверный пароль'})
            }
            const token = jwtHelper.sign({user: user.email, id: user._id}, 60*60)
            const remember = jwtHelper.sign({user: user.email, id: user._id}, 60*60*24*7)
            user.rememberToken = remember
            await user.save()
            user.password = undefined
            return res.json({
                user: user,
                token: token,
                remember: remember
            })
        }
        catch (e) {
            return next(e)
        }
    },
    async remember(req, res, next) {
        try {
            const {token} = req.body
            const user = await userRepository.getByRemember(token)
            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'})
            }
        }
        catch (e) {

            return next(e)
        }
    },
    async verify(req, res, next) {
        try {
            if (req.body.token) {
                const data = jwtHelper.verify(req.body.token)
                if (data) {
                    const user = await userRepository.getByEmail(data.user)
                    if (user && !user.verify) {
                        user.verify = true
                        await user.save()
                        return res.json({message: 'Профиль подтвержден'})
                    }
                }
            }
            return res.status(403).json({message: 'Токен просрочен или не существует'})
        }
        catch (e) {
            return next(e)
        }
    },
    async reset(req, res, next) {
        try {
            if (!req.body.token) {
                const user = await userRepository.getByEmail(req.body.email)
                if (!user) {
                    return res.status(403).json({message: 'Пользователь не найден'})
                }
                const mail = await mailController.resetSend(user)
                if (mail) {
                    return res.json({message: 'Ссылка на востановления пароля отправлена'})
                }
                else {
                    return  res.status(500).json({message: 'Что то пошло не так'})
                }
            }
            else {
                const {token, password} = req.body
                const jwt = jwtHelper.verify(token)
                if (jwt) {
                    const user = await userRepository.getByEmail(jwt.user)
                    if (user) {
                        user.password = bcyptHelper.generateHash(password)
                        await user.save()
                        return res.json({message: 'Пароль успешно обновлен'})
                    }
                }
                return res.status(403).json({
                    message: 'Что-то пошло не так'
                })
            }
        }
        catch (e) {
            return next(e)
        }
    },
    async register(req, res, next) {
        try {
            const findUser = await userRepository.getByEmail(req.body.email)
            if (findUser) {
                return res.status(401).json({message: 'Пользователь уже существует'})
            }
            const findRole = await userRepository.getRoleByName('user')
            req.body.role = findRole
            const createUser = await userRepository.createUser(req.body)
            if (createUser) {
                return res.json({message: 'Пользователь успешно создан'})
            }
            return res.status(404).json({message: 'Пользователь не найден'})
        }
        catch (e) {

            return next(e)
        }
    },
}