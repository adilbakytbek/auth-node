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
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const result = await authService.refreshToken(refreshToken)
            res.cookie('refreshToken', result.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.json(result)
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
            const {email} = req.body
            await authService.resetPassword(email)
            res.status(200)
            res.json({message: 'Пароль успешно изменён'})
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json({'message': 'Пользователь успешно удалён'})
        } catch (e) {
            next(e)
        }

    }

    async getUser(req, res, next) {
        try {
            const users = await authService.getUser()
            console.log(req)
            res.json(users)
        } catch (e) {
            next(e)
        }

    }

}

module.exports = new AuthController()