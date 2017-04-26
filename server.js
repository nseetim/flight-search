
const express = require('express');
const path = require('path');
const glob = require('glob');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const engine = require('ejs-mate');
const config = require('./app/config');
const log = require('./app/logger');

log.info(`Running in ${config.name}`);

const app = express();
const env = config.name;
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

app.engine('ejs', engine);
app.set('views', path.join(config.root, '/app/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(compress());

const serveStatics = express.static(path.join(config.root, '/public'));
app.use((req, res, next) => {
  if (/^\/src/.test(req.path)) {
    res.status(404).send(`${req.path} not found`);
    return null;
  }
  return serveStatics(req, res, next);
});

const controllers = glob.sync(path.join(config.root, '/app/controllers/*.js'));
controllers.forEach((controller) => {
  require(controller)(app); // eslint-disable-line
});

app.use((err, req, res) => {
  const status = err.status || 500;
  res.status(status);

  if (status === 500) {
    log.error('An unexpected error occurred', err);
  }

  if ((res.getHeader('Content-Type') || '').indexOf('application/json') >= 0) {
    res.json({ message: (err.message || 'Internal Server Error'), status });
  } else {
    res.render('error', {
      message: err.message || 'Internal Server Error',
      error: (app.get('env') === 'development') ? err : {},
      title: 'Error'
    });
  }
});

app.listen(config.port, () => {
  log.info(`Express server listening on port ${config.port}`);
});

