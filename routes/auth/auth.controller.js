const authService = require('../../services/auth.service')

class AuthController {
    async register(req, res, next) {
        try {
            const {email, password} = req.body
            const newUser = await authService.register(email, password)
            return res.json(newUser)
        } catch (e) {
            console.log(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await authService.validateUser(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async refresh(req, res, next) {
        try {
            return res.send('Refresh')
        } catch (e) {
            console.log(e)
        }
    }

    async activateAccount(req, res, next) {
        try {
            return res.send('Activate Account')
        } catch (e) {
            console.log(e)
        }
    }

    async resetPassword(req, res, next) {
        try {
            return res.send('ResetPassword')
        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = new AuthController()