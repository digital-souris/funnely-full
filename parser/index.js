import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import database from '../config/database'
import parserController from "./controllers/parserController";
import "../config/cron";
import Channel from "../database/Channel";
import channelController from "./controllers/channelController";
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
    app.listen(process.env.PORT, () => {
        console.log(`Сервер запущен ` + process.env.PORT)
    })
    const date = new Date()
    if (date.getHours() % 4 === 0) {
        await parserController.findChannels()
    }
    else if (date.getHours() % 3 === 0) {
        await parserController.startParseChannelData()
    }
    else {
        await parserController.startParseStates()
        await parserController.startParseStatesData()
    }
})