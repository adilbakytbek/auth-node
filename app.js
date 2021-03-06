const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const apiRouter = require('./routes/api')

const app = express()
const PORT = config.get('port') || 5000

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(passport.initialize())
require('./middlewares/passport')(passport)

app.use('/api', apiRouter)

app.use(require('./middlewares/error-midleware'))

const start = async () => {
    try {
        await mongoose.connect(config.get('mongo_url'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log('MongoDB ready'))
        app.listen(PORT, () => console.log(`Server has benn started at ${PORT} port...`))
    } catch (e) {
        console.log(e)
    }
}

start()