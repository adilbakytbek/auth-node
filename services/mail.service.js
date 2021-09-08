const nodemailer = require('nodemailer')
const config = require('config')

class MailService {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: config.get('SMTP-Mail.host'),
            port: config.get('SMTP-Mail.port'),
            secure: config.get('SMTP-Mail.secure'),
            auth: {
                user: config.get('SMTP-Mail.user'),
                pass: config.get('SMTP-Mail.pass')
            }
        })
    }

    async sendActivation(to, link) {
        await this.transport.sendMail({
            from: process.env.SMTP_LOGIN,
            to,
            subject: 'Активация аккаунта ' + config.get('site_url.clientUrl'),
            text: '',
            html:
                `
                 <div>
                    <h1>Чтобы активировать аккаунт нажмите на ссылку ниже</h1>
                    <a href="${link}">Активировать аккаунт</a> 
                 </div>  
                `
        }, () => console.log('Mail sent'))
    }

    async sendResetMail(to, newPassword) {
        await this.transport.sendMail({
            from: process.env.SMTP_LOGIN,
            to,
            subject: `Новый пароль на сайте ${config.get('site_url.clientUrl')}`,
            text: '',
            html:
                `
                    <div>
                        <h1>Ваши новые данные</h1>
                        <p><b>Логин:</b> ${to}</p>
                        <p><b>Пароль:</b> ${newPassword}</p>
                       </div>
                `
        }, () => {
            console.log('The link was sent successfully')
        })

    }
}

module.exports = new MailService()