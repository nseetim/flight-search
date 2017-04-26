const path = require('path');
const bunyan = require('bunyan');

const rootPath = path.normalize(path.join(__dirname, '/..'));
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    name: 'development',
    root: rootPath,
    app: {
      name: 'Flight Search App'
    },
    logger: {
      level: 'debug'
    },
    port: process.env.PORT || 3000
  },

  test: {
    name: 'test',
    root: rootPath,
    app: {
      name: 'Flight Search App'
    },
    logger: {
      level: bunyan.FATAL + 1 // Off
    },
    port: process.env.PORT || 3000
  },

  production: {
    name: 'production',
    root: rootPath,
    app: {
      name: 'Flight Search App'
    },
    logger: {
      level: 'info'
    },
    port: process.env.PORT || 3000
  }
};

module.exports = config[env];
