const uuid = require('uuid')
const bcrypt = require('bcrypt')
const config = require('config')
const randomString = require('randomstring')

const User = require('../models/User.model')
const Role = require('../models/Roles.model')
const mailService = require('../services/mail.service')
const UserDto = require('../dto/user.dto')
const tokenService = require('../services/token.service')
const ApiError = require('../exceptions/api-error')

class AuthService {
    async register(email, password) {
        const candidate = await User.findOne({email})

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь ${email} уже зарегистрирован`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activatedLink = uuid.v4()
        await mailService.sendActivation(email, `${config.get('site_url.apiUrl')}/auth/activate/${activatedLink}`)
        const userRole = await Role.findOne({value: "User"})

        const userData = await User.create({email, password: hashPassword, activatedLink, role: userRole.value})

        return new UserDto(userData)

    }

    async validateUser(email, password) {
        const candidate = await User.findOne({email})

        if (!candidate) {
            throw ApiError.BadRequest(`Пользователь ${email} не зарегистрирован`)
        }

        const equalPassword = await bcrypt.compare(password, candidate.password)

        if (!equalPassword) {
            throw ApiError.BadRequest(`Неверный пароль`)
        }

        if (!candidate.isActive) {
            throw ApiError.BadRequest(`Аккаунт не активирован`)
        }

        const userDto = new UserDto(candidate)
        return this.login(userDto)

    }

    async login(payload) {
        const tokens = await tokenService.generateToken({...payload})
        await tokenService.saveToken(tokens.refreshToken, payload.id)
        return {
            ...tokens,
            payload
        }
    }

    async refreshToken(token) {
        if (!token) {
            throw ApiError.UnAuthorizedError()
        }

        const userData = await tokenService.validateToken(token)
        const tokenFound = await tokenService.findRefreshToken(token)


        if (!userData || !tokenFound) {
            throw ApiError.UnAuthorizedError()
        }

        const user = await User.findById(userData.id)


        const userDto = new UserDto(user)

        const tokens = await tokenService.generateToken({...userDto})


        await tokenService.saveToken(tokens.refreshToken, userDto.id)

        return {
            ...tokens,
            userDto
        }
    }

    async activateAccount(link) {
        const userData = await User.findOne({activatedLink: link})
        if (!userData) {
            throw ApiError.BadRequest(`Такой ссылкий не существует`)
        }
        userData.isActive = true
        userData.activatedLink = ''
        await userData.save()
    }

    async resetPassword(email) {
        const user = await User.findOne({email})

        if (!user) {
            throw ApiError.BadRequest(`Пользователь ${email} не зарегистрирован`)
        }

        const newPassword = randomString.generate(10)
        user.password = await bcrypt.hash(newPassword, 3)
        await user.save()
        await mailService.sendResetMail(user.email, newPassword)
    }

    async logout(token) {
        return await tokenService.removeToken(token)
    }

    async getUser() {
        return User.find({})
    }

}

module.exports = new AuthService()