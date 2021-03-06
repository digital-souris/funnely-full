import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import database from '../config/database'
import parserController from "./controllers/parserController";
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
    await parserController.startParseStatesData()
    await parserController.startParseStates()
    await parserController.startParseChannelData()
    await parserController.findChannels()
})