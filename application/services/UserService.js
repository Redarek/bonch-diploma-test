const UserRepository = require('../../infrastructure/repositories/UserRepository')
const TokenService = require('./TokenService');
const ApiError = require('../exceptions/ApiError');
const bcrypt = require('bcrypt');

class UserService {
    async registration(username, password) {

        const candidateUsername = await UserModel.findOne({username});
        if (candidateUsername) {
            throw ApiError.badRequest(`Пользователь с username ${username} уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3); //хэшируем пароль

        const user = await UserRepository.registration(username, hashPassword)

        const tokens = TokenService.generateTokens({...user}); // генерируем JWT токены
        await TokenService.saveToken(user.id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens, user: user
        }
    }


    async login(username, password) {
        const user = await UserRepository.getUserByUsername(username)
        if (!user) {
            throw ApiError.badRequest('Пользователь с таким username не найден')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDTO(user); //генерируем dto, выбрасываем из модели всё ненужное
        const tokens = TokenService.generateTokens({...user}); // генерируем JWT токены
        await TokenService.saveToken(userDto.id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens, user: userDto
        }
    }

    async logout(refreshToken) {
        return await TokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.unauthorizedError();
        }
        // console.log(userData);
        const user = await UserRepository.getUserByID(userData.id)
        // код ниже можно вынести в отдельную функцию
        const tokens = TokenService.generateTokens({...user}); // генерируем JWT токены
        await TokenService.saveToken(user.id, tokens.refreshToken); // сохраняем рефреш токен в БД

        // возвращаем инфу о польз-ле и токены
        return {
            ...tokens, user: user
        }
    }

    async getUsers(query = null) {
        return await UserRepository.getUsers()
    }
}

module.exports = new UserService();
