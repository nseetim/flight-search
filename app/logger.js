const bunyan = require('bunyan');
const config = require('./config');

const log = bunyan.createLogger({
  name: config.app.name,
  level: config.logger.level
});

['trace', 'debug', 'info', 'warn', 'error'].forEach((level) => {
  log[level]('enabled');
});

module.exports = log;
