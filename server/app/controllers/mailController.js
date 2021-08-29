import nodemailer from 'nodemailer'
import jwtHelper from "../helpers/jwtHelper";
import dotenv from 'dotenv'

dotenv.config()

export default {
    async getTransport() {
        try {
            let account = {}
            if (process.env.NODE_ENV !== 'production') {
                account = await nodemailer.createTestAccount()
            } else {
                account = {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            }
            if (process.env.NODE_ENV !== 'production') {
                return await nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    }
                })
            }
            return await nodemailer.createTransport({
                host: process.env.MAIL_SMTP,
                port: process.env.MAIL_PORT,
                secure: process.env.MAIL_SECURE,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

        } catch (e) {
            console.log(e)
            return false
        }
    },
    async registerSend(user) {
        try {
            const token = jwtHelper.sign({user: user.email}, 60 * 60)
            const link = `https://funnelly.ru/auth/verify?token=${token}`
            const transport = await this.getTransport()
            let content = `<h1>Вы зарегистрировались на сервисе, подтвердите свою почту для активации акаунта</h1>`
            content+=`<a href="${link}">${link}</a>`
            let info = await transport.sendMail({
                from: 'info@funnelly.ru',
                to: user.email,
                subject: 'Активация аккаунта',
                html: content
            })
            console.log("Message sent: %s", info.messageId);
            if (process.env.NODE_ENV !== 'production') {
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async resetSend(user) {
        try {
            const token = jwtHelper.sign({user: user.email}, 60 * 60)
            const link = `https://funnelly.ru/auth/reset?token=${token}`
            const transport = await this.getTransport()
            let content = `<h1>Востановление пароля, для востановления перейдите по ссылке</h1>`
            content+=`<a href="${link}">${link}</a>`
            let info = await transport.sendMail({
                from: 'info@funnelly.ru',
                to: user.email,
                subject: 'Востановление пароля',
                html: content
            })
            console.log("Message sent: %s", info.messageId);
            if (process.env.NODE_ENV !== 'production') {
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    },
}