module.exports = class UserDto {
    constructor(model) {
        this.id = model._id
        this.email = model.email
        this.isActive = model.isActive
        this.role = model.role
    }
}