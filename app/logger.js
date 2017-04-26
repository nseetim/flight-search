const bunyan = require('bunyan');
const config = require('./config');

const log = bunyan.createLogger({
  name: config.app.name,
  level: config.logger.level
});

console.log(); // eslint-disable-line no-console
['trace', 'debug', 'info', 'warn', 'error'].forEach((level) => {
  log[level]('enabled');
});
console.log(); // eslint-disable-line no-console
console.log(); // eslint-disable-line no-console

module.exports = log;
