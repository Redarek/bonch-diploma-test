const UserService = require('../services/UserService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }
            const {username, password} = req.body;
            const userData = await UserService.registration(username, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true
            })
            return res.json({data: userData, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const {username, password} = req.body;
            const userData = await UserService.login(username, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true
            });
            return res.json({data: userData, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies; // вытаскиваем рефреш-токен  из куки
            const token = await UserService.logout(refreshToken); // передаем рефреш-токен в юзер сервис
            res.clearCookie('refreshToken'); // удаляем рефреш-токен из куки
            return res.json({data: token, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true
            });
            return res.json({data: userData, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getUsers();
            return res.json({data: users, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new UserController();
