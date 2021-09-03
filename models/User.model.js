const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: false},
    activatedLink: {type: String, unique: true},
    role: {type: Schema.Types.ObjectId, ref: 'Roles'}
}, {timestamps: true})

module.exports = model('Users', UserSchema)