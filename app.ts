import * as express from 'express'
import * as mongoose from 'mongoose'
import * as config from 'config'
import authRoutes from './routes/auth.routes'
import confirmEmailRoutes from './routes/confirmEmail.routes'
import changePasswordRoutes from './routes/changePassword'
import * as path from 'path'
import * as compression from 'compression'
import for_authorized_usersRoutes from './routes/for_authorized_users.routes'

const app = express()
export const PORT = process.env.$PORT || '5000'
const mongoUri: string = config.get('mongoUri')
app.set('port', (process.env.PORT || 5000))
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use('/api/auth', authRoutes)
app.use('/api/confirmEmail', confirmEmailRoutes)
app.use('/api/recover_password', changePasswordRoutes)
app.use('/api/for_authorized_users', for_authorized_usersRoutes)

app.use(express.static(path.resolve(__dirname, 'client/')))
app.get('*', ( _req, res ) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

async function start(): Promise<void> {
    await mongoose.connect(mongoUri)
    
    app.get('/', function(request, response) {
        var result = 'App is running'
        response.send(result);
    }).listen(app.get('port'), function() {
            console.log('App is running, server is listening on port ', app.get('port'));
    })
}

start().catch(( e ) => {
        console.log(e)
        process.exit(1)
    }
)
