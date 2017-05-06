/**
 * Wrapper for the fetch api that provides an easier
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
  return response.json().then((jsonErr) => {
    error.details = jsonErr;
    throw error;
  }, () => {
    throw error;
  });
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
 * @param {object} params the request's params. They are sent in the query string.
 * @param {object} fetchOptions additional options for the fetch API.
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
