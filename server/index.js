import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import database from '../config/database'
import { Nuxt, Builder } from 'nuxt'

let config = require('../client/nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

dotenv.config()


const app = express()

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
} else {
    app.use(morgan('combined'))
}


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const db = database.connection


db.on('error', (err) => {
    console.log(err)
})
db.once('open', async () => {
    const nuxt = new Nuxt(config)
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }
    else {
        await nuxt.ready()
    }
    app.use(nuxt.render)
    app.listen(process.env.PORT, () => {
        console.log(`Сервер запущен ` + process.env.PORT)
    })
})