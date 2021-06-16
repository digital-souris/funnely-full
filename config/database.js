import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('debug', true)

mongoose.set('useCreateIndex', true)

mongoose.connect(process.env.DATABASE_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


export default mongoose