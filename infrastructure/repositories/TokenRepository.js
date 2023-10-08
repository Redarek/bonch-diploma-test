const TokenModel = require("../models/TokenModel");

class TokenRepository {

    async createToken(userID, refreshToken) {
        return await TokenModel.create({user: userID, refreshToken});
    }

    async removeToken(refreshToken) {
        return TokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken) {
        return TokenModel.findOne({refreshToken});
    }

    async findTokenByUserID(userID) {
        return TokenModel.findOne({user: userID});
    }

}

module.exports = new TokenRepository()