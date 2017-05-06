/* eslint-disable no-param-reassign */
const express = require('express');
const path = require('path');
const glob = require('glob');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const engine = require('ejs-mate');
const favicon = require('serve-favicon');
const log = require('../logger');

module.exports = (app, config) => {
  const env = config.name;
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.engine('ejs', engine);
  app.set('views', path.join(config.root, '/app/views'));
  app.set('view engine', 'ejs');
  app.use(favicon(path.join(config.root, '/favicon.png')));

  if (config.logger.morgan !== 'off') {
    app.use(morgan(config.logger.morgan));
  }
  app.use(bodyParser.json());
  app.use(compress());

  const serveStatics = express.static(path.join(config.root, '/app/public'));
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

  app.use((req, res, next) => {
    if (req.path === '/') {
      res.redirect('/index.html');
      return;
    }
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, _next) => { // eslint-disable-line
    const status = err.status || 500;
    res.status(status);

    if (status === 500) {
      log.error('An unexpected error occurred', err);
    }

    const wantsJson = (req.get('Accept') || '').indexOf('application/json') >= 0;
    const receivingJson = (res.getHeader('Content-Type') || '').indexOf('application/json') >= 0;
    if (wantsJson || receivingJson) {
      res.json({ message: (err.message || 'Internal Server Error'), status });
    } else {
      res.render('error', {
        message: err.message || 'Internal Server Error',
        error: (app.get('env') === 'development') ? err : {},
        title: 'Error'
      });
    }
  });
};
