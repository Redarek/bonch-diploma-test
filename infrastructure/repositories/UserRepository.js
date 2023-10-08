const UserModel = require("../models/UserModel");
const UserDto = require("../../domain/UserDTO");

class UserRepository {

    async registration(username, hashPassword) {
        return new UserDto(await UserModel.create({username: username, password: hashPassword}));
    }

    async getUserByUsername(username = null) {
        return new UserDto(await UserModel.findOne({username: username}))
    }

    async getUserByID(userID = null) {
        return new UserDto(await UserModel.findById(userID))
    }

    async getUsers(query = null) {
        const users = await UserModel.find()
        for (let i = 0; i < users.length; i++) {
            users[i] = new UserDto(users[i])
        }
        return users
    }


}

module.exports = new UserRepository()