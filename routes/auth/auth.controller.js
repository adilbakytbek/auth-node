const authService = require('../../services/auth.service')
const config = require('config')

class AuthController {
    async register(req, res, next) {
        try {
            const {email, password} = req.body
            const newUser = await authService.register(email, password)
            return res.json(newUser)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await authService.validateUser(email, password)
            res.cookie('refreshToken', userData.refreshToken)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async refreshToken(req, res, next) {
        try {
            return res.send('Refresh')
        } catch (e) {
            next(e)
        }
    }

    async activateAccount(req, res, next) {
        try {
            const link = req.params.link
            await authService.activateAccount(link)
            return res.redirect(config.get('site_url.clientUrl'))
        } catch (e) {
            next(e)
        }
    }

    async resetPassword(req, res, next) {
        try {
            return res.send('ResetPassword')
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new AuthController()