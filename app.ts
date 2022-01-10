import * as express from 'express'
import * as mongoose from 'mongoose'
import * as config from 'config'
import authRoutes from './routes/auth.routes'
import eventRoutes from './routes/event.routes'
import confirmEmailRoutes from "./routes/confirmEmail.routes";
import cleardbRoutes from "./routes/cleardb.routes";

const app = express()
const PORT: number = config.get('port') || 5000
const mongoUri: string = config.get('mongoUri')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/confirmEmail', confirmEmailRoutes)
app.use('/api/server', cleardbRoutes)


async function start(): Promise<void> {
    await mongoose.connect(mongoUri)
    app.listen(PORT, () => {
        console.log(`App has been started on port ${PORT}...`)
    })
}

start().catch((e) => {
        console.log(e)
        process.exit(1)
    }
)