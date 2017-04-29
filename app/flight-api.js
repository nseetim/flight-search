/**
 * Issue requests to Locomote's flight api.
 */
const httpGet = require('./shared/http-client').httpGet;

const BASE_URL = 'http://node.locomote.com/code-task';

function urlFor(path) {
  return `${BASE_URL}/${path}`;
}

function fetchAirlines() {
  return httpGet(urlFor('airlines'));
}

function fetchAirports() {
  return httpGet(urlFor('airports'));
}

function searchFlights(dates, from, to) {
  const airlinesFetch = fetchAirlines();
  const results = dates.reduce((indexedDates, date) => {
    return Object.assign(indexedDates, { [date]: [] });
  }, {});

  return airlinesFetch.then((airlines) => {
    return Promise.all(airlines.map((airline) => {
      return Promise.all(dates.map((date) => {
        const params = { date, from, to };
        return httpGet(
          urlFor(`flight_search/${airline.code}`),
          params
        ).then((flights) => {
          results[date] = results[date].concat(flights);
        });
      }));
    }));
  })
  .then(() => results);
}

module.exports = {
  fetchAirlines,
  fetchAirports,
  searchFlights,
  urlFor
};
