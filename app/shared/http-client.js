/**
 * Wrapper for the fetch api that providades a easier
 * interface and error handling.
 */

require('isomorphic-fetch');

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.status = response.status;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  if (response.status !== 204) {
    return response.json();
  }
  return {};
}

/**
 * Issue a GET request to `path`
 *
 * @param {string} path the path/url
 * @param {object} params the request's params. They are sended in the query string.
 * @param {object} fetchOptions aditional options for the fetch API.
 */
function httpGet(path, params = {}, fetchOptions = {}) {
  const queryString = Object.keys(params).reduce((query, param, idx) => {
    const sep = idx === 0 ? '?' : '&';
    const key = encodeURIComponent(param);
    const value = encodeURIComponent(params[param]);
    return `${query}${sep}${key}=${value}`;
  }, '');
  const options = Object.assign({ headers: defaultHeaders }, fetchOptions);
  return fetch(`${path}${queryString}`, options)
    .then(checkStatus)
    .then(parseJSON);
}

module.exports = {
  httpGet
};
