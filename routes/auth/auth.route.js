const authRoute = require('express').Router()
const authController = require('./auth.controller')

// Post
authRoute.post('/register', authController.register)
authRoute.post('/login', authController.login)
authRoute.post('/reset-password', authController.resetPassword)
authRoute.post('/logout', authController.logout)
// Get
authRoute.get('/refreshToken', authController.refreshToken)
authRoute.get('/activate/:link', authController.activateAccount)

module.exports = authRoute