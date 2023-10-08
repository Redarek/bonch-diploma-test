const jwt = require('jsonwebtoken');
const TokenRepository = require('../../infrastructure/repositories/TokenRepository')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1d'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken, refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }

    async saveToken(userID, refreshToken) {
        const token = TokenRepository.findTokenByUserID(userID)
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        return TokenRepository.createToken(userID, refreshToken)
    }

    async removeToken(refreshToken) {
        return TokenRepository.removeToken(refreshToken)
    }

    async findToken(refreshToken) {
        return TokenRepository.findToken(refreshToken)
    }

}

module.exports = new TokenService();