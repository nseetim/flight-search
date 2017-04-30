/* eslint-disable no-underscore-dangle */
require('isomorphic-fetch');
const supertest = require('supertest');
const express = require('express');
const config = require('../app/config');

const app = express();
require('../app/config/express')(app, config);

function fakeFetch(url) {
  const mockDef = fakeFetch.__mockDef;
  const response = mockDef[url];
  if (!response) {
    return Promise.resolve({
      status: 404,
      message: `404 for url ${url}`,
      json: () => Promise.reject('404')
    });
  }
  return Promise.resolve({
    status: response.status,
    json: () => Promise.resolve(response.body)
  });
}

fakeFetch.__mockDef = {};
fakeFetch.mockRequest = (url, response) => {
  fakeFetch.__mockDef[url] = response;
};
fakeFetch.restore = () => {
  fakeFetch.__mockDef = {};
};

function fakeServer() {
  return supertest(app);
}

module.exports = {
  fakeFetch,
  fakeServer
};

