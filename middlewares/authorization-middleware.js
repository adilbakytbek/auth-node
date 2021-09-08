const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token.service')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return next(ApiError.UnAuthorizedError())
        }

        const accessToken = authHeader.split(' ')[1]
        const userData = tokenService.validateToken(accessToken)

        if (!userData) {
            return next(ApiError.UnAuthorizedError())
        }

        res.user = userData
        next()

    } catch (e) {
        return next(ApiError.UnAuthorizedError())
    }
}