const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const apiRouter = require('./routes/api')

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use('/api', apiRouter)
app.get('/', (req, res, next) => {
    res.send('Working')
})

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