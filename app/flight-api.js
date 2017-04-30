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

function fetchAirports(city) {
  return httpGet(urlFor('airports'), { q: city });
}

function doSearchFlights(airlineCode, date, from, to) {
  const params = { date, from, to };
  return httpGet(
    urlFor(`flight_search/${airlineCode}`),
    params
  );
}

function searchFlights(dates, from, to) {
  const results = {};
  const pall = arr => Promise.all(arr);

  return pall([fetchAirlines(), fetchAirports(from), fetchAirports(to)])
  .then(([airlines, origAirports, destAirports]) => {
    return pall(airlines.map((airline) => {
      return pall(origAirports.map((origAirport) => {
        return pall(destAirports.map((destAirport) => {
          return pall(dates.map((date) => {
            return doSearchFlights(
              airline.code,
              date,
              origAirport.airportCode,
              destAirport.airportCode
            ).then((flights) => {
              results[date] = (results[date] || []).concat(flights);
            }).catch((err) => {
              if (err.status !== 404) throw err;
            });
          }));
        }));
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
