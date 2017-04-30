const assert = require('assert');
const simple = require('simple-mock');
const fakeFetch = require('./support').fakeFetch;
const flightApi = require('../app/flight-api');
const fixtures = require('./fixtures');

describe('Flight API', () => {
  beforeEach(() => {
    simple.mock(global, 'fetch', fakeFetch);
  });

  afterEach(() => {
    simple.restore(global, 'fetch');
    fakeFetch.restore();
  });

  it('constructs the proper url', () => {
    assert.equal(
      flightApi.urlFor('airlines'),
      'http://node.locomote.com/code-task/airlines'
    );
  });

  it('fetches airlines', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    flightApi.fetchAirlines().then((airlines) => {
      assert.deepEqual(airlines, fixtures.airlines);
      done();
    }).catch(done);
  });

  it('fetches airports', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airports'), {
      status: 200, body: fixtures.airports
    });
    flightApi.fetchAirports().then((airlines) => {
      assert.deepEqual(airlines, fixtures.airports);
      done();
    }).catch(done);
  });

  it('searches for flights', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2017-01-01&from=a&to=b'),
      { status: 200, body: fixtures.flights['1']['2017-01-01'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2017-01-02&from=a&to=b'),
      { status: 200, body: fixtures.flights['1']['2017-01-02'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2016-01-01&from=a&to=b'),
      { status: 200, body: fixtures.flights['1']['2016-01-01'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2017-01-01&from=a&to=b'),
      { status: 200, body: fixtures.flights['2']['2017-01-01'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2017-01-02&from=a&to=b'),
      { status: 200, body: fixtures.flights['2']['2017-01-02'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2016-01-01&from=a&to=b'),
      { status: 200, body: fixtures.flights['2']['2016-01-01'] }
    );

    Promise.all([
      flightApi.searchFlights(['2017-01-01', '2017-01-02'], 'a', 'b'),
      flightApi.searchFlights(['2016-01-01'], 'a', 'b')
    ]).then((results) => {
      assert.deepEqual(results[0], {
        '2017-01-01': [
          { key: 1, price: 100 },
          { key: 2, price: 200 },
          { key: 5, price: 100 }
        ],
        '2017-01-02': [
          { key: 3, price: 50 },
          { key: 6, price: 200 },
          { key: 7, price: 50 }
        ]
      });
      assert.deepEqual(results[1], {
        '2016-01-01': [
          { key: 4, price: 200 },
          { key: 8, price: 200 }
        ]
      });
      done();
    }).catch(done);
  });

  it('ignores 404 errors when searching for flights', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2017-01-01&from=a&to=b'),
      { status: 200, body: fixtures.flights['1']['2017-01-01'] }
    );
    flightApi.searchFlights(['2017-01-01', '2017-01-02'], 'a', 'b').then((flights) => {
      assert.deepEqual(flights, {
        '2017-01-01': [
          { key: 1, price: 100 },
          { key: 2, price: 200 }
        ]
      });
      done();
    }).catch(done);
  });
});
