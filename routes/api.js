const apiRouter = require('express').Router()
const authRouter = require('./auth/auth.route')

apiRouter.use('/auth', authRouter)
apiRouter.get('/', (req, res) => {
    res.send('work')
})

module.exports = apiRouter