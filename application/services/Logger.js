const pino = require('pino');
const destination = pino.destination('../../logs/logs.txt');

const logger = pino({
    prettyPrint: { colorize: true },
    level: 'trace',
    timestamp: () => `,"time":"${new Date().toISOString()}"`
}, destination);

module.exports = logger;