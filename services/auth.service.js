const uuid = require('uuid')
const bcrypt = require('bcrypt')

const User = require('../models/User.model')
const mailService = require('../services/mail.service')
const UserDto = require('../dto/user.dto')

class AuthService {
    async register(email, password) {
        const candidate = await User.findOne({email})

        if (candidate) {
            throw new Error(`Пользователь ${email} уже зарегистрирован`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activatedLink = uuid.v4()
        await mailService.sendMail()

        return await User.create({email, password: hashPassword, activatedLink})
    }

    async validateUser(email, password) {
        const candidate = await User.findOne({email})

        if (!candidate) {
            throw new Error(`Пользователь ${email} не зарегистрирован`)
        }

        const equalPassword = await bcrypt.compare(password, candidate.password)

        if (!equalPassword) {
            throw new Error(`Неверный пароль`)
        }

        if (!candidate.isActive) {
            throw new Error(`Аккаунт не активирован`)
        }

        const userDto = new UserDto(candidate)
        return this.login(userDto)

    }

    async login(payload) {

    }

    async refresh() {

    }

    async activateAccount() {

    }

    async resetPassword(email) {

    }
}

module.exports = new AuthService()