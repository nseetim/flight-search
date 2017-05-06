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
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 200, body: fixtures.airports['São Paulo']
    });
    flightApi.fetchAirports('São Paulo').then((airlines) => {
      assert.deepEqual(airlines, fixtures.airports['São Paulo']);
      done();
    }).catch(done);
  });

  it('searches for flights', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 200, body: fixtures.airports['São Paulo']
    });
    fakeFetch.mockRequest(flightApi.urlFor('airports?q=Chicago'), {
      status: 200, body: fixtures.airports.Chicago
    });

    const mockFlightSearch = (arlCode, date, from, to) => {
      const fromTo = `${from}-${to}`;
      const data = fixtures.flights[arlCode][date][fromTo];
      fakeFetch.mockRequest(
        flightApi.urlFor(`flight_search/${arlCode}?date=${date}&from=${from}&to=${to}`),
        { status: data ? 200 : 404, body: data }
      );
    };

    ['9999-01-01', '9999-01-02', '9998-01-01'].forEach((date) => {
      ['1', '2'].forEach((arlCode) => {
        mockFlightSearch(arlCode, date, 'ORD', 'CGH');
        mockFlightSearch(arlCode, date, 'ORD', 'GRU');
        mockFlightSearch(arlCode, date, 'MDW', 'CGH');
        mockFlightSearch(arlCode, date, 'MDW', 'GRU');
      });
    });

    Promise.all([
      flightApi.searchFlights(['9999-01-01', '9999-01-02'], 'Chicago', 'São Paulo'),
      flightApi.searchFlights(['9998-01-01'], 'Chicago', 'São Paulo')
    ]).then((results) => {
      assert.deepEqual(results[0], {
        '9999-01-01': [
          { key: 1, price: 100 },
          { key: 2, price: 200 },
          { key: 3, price: 100 },
          { key: 4, price: 150 },
          { key: 5, price: 150 },
          { key: 10, price: 200 },
          { key: 11, price: 200 },
        ],
        '9999-01-02': [
          { key: 6, price: 100 },
          { key: 7, price: 150 },
          { key: 12, price: 100 }
        ]
      });
      assert.deepEqual(results[1], {
        '9998-01-01': [
          { key: 8, price: 150 },
          { key: 9, price: 150 },
          { key: 13, price: 150 }
        ]
      });
      done();
    }).catch(done);
  });

  it('ignores 404 errors when searching for flights', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 200, body: fixtures.airports['São Paulo']
    });
    fakeFetch.mockRequest(flightApi.urlFor('airports?q=Chicago'), {
      status: 200, body: fixtures.airports.Chicago
    });
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=9999-01-01&from=ORD&to=CGH'),
      { status: 200, body: fixtures.flights['1']['9999-01-01']['ORD-CGH'] }
    );
    flightApi.searchFlights(['9999-01-01', '9999-01-02'], 'Chicago', 'São Paulo').then((flights) => {
      assert.deepEqual(flights, {
        '9999-01-01': [
          { key: 1, price: 100 },
          { key: 2, price: 200 }
        ]
      });
      done();
    }).catch(done);
  });
});
