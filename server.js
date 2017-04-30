
const express = require('express');
const config = require('./app/config');
const configExpress = require('./app/config/express');
const log = require('./app/logger');

log.info(`Running in ${config.name}`);

const app = express();
configExpress(app, config);

app.listen(config.port, () => {
  log.info(`Express server listening on port ${config.port}`);
});

