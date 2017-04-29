/* eslint-disable no-underscore-dangle */
require('isomorphic-fetch');

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

module.exports = {
  fakeFetch
};

