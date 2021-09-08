const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token.service')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return next(ApiError.UnAuthorizedError())
        }
    } catch (e) {
        return next(ApiError.BadRequest('У вас нет прав', e))
    }
}