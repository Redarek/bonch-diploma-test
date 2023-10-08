logger = require('../services/Logger')

class LogsController {

    async writeLogs(req, res, next) {
        try {
            const level = req.body['data']['level']
            const message = req.body['data']['message']
            switch (level) {
                case 'trace':
                    logger.trace(message)
                    break
                case 'debug':
                    logger.debug(message)
                    break
                case 'info':
                    logger.info(message)
                    break
                case 'warn':
                    logger.warn(message)
                    break
                case 'error':
                    logger.error(message)
                    break
                case 'fatal':
                    logger.fatal(message)
                    break
            }
            return res.json({data: null, status: 'success'});
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new LogsController();