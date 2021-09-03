const {Schema, model} = require('mongoose')

const RolesSchema = new Schema({
    value: {type: String, default: "User"}
})

module.exports = model('Roles', RolesSchema)