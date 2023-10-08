const Router = require('express').Router;
const {body} = require('express-validator');
const UserController = require('../application/controllers/UserController');
const LogsController = require('../application/controllers/LogsController')
const AuthMiddleware = require('../application/middlewares/AuthMiddleware');

const router = new Router();

router.post('/registration',
    body('username').isLength({min: 3, max: 32}),
    body('password').isLength({min: 3, max: 32}),
    UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
router.get('/users', AuthMiddleware, UserController.getUsers);
router.post('/logs', AuthMiddleware, LogsController.writeLogs)

module.exports = router;
