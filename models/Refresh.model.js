const {Schema, model} = require('mongoose')

const RefreshSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    refreshToken: {type: String, required: true}
}, {timestamps: true})

module.exports = model('RefreshToken', RefreshSchema)