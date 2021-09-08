const jwt = require('jsonwebtoken')
const config = require('config')
const Refresh = require('../models/Refresh.model')

class TokenService {
    async generateToken(payload) {
        try {
            const accessToken = jwt.sign(payload, config.get('JWT_Secret_Key'), {expiresIn: '15m'})
            const refreshToken = jwt.sign(payload, config.get('JWT_Secret_Key'), {expiresIn: '30d'})
            return {
                accessToken,
                refreshToken
            }
        } catch (e) {
            console.log(e)
        }
    }

    async saveToken(refreshToken, userId) {
        const userData = await Refresh.findOne({userId})
        if (userData) {
            userData.refreshToken = refreshToken
            return userData.save()
        }
        return await Refresh.create({userId, refreshToken})
    }

    async validateToken(token) {
        try {
            return jwt.verify(token, config.get('JWT_Secret_Key'))
        } catch (e) {
            return null
        }
    }

    async findRefreshToken(refreshToken) {
        try {
            return await Refresh.findOne({refreshToken})
        } catch (e) {
            return null
        }
    }

    async removeToken(refreshToken) {
        return Refresh.deleteOne({refreshToken})
    }

}

module.exports = new TokenService()