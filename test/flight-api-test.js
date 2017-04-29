const assert = require('assert');
const simple = require('simple-mock');
const fakeFetch = require('./support').fakeFetch;
const flightApi = require('../app/flight-api');

describe('Flight API', () => {
  beforeEach(() => {
    simple.mock(global, 'fetch', fakeFetch);
  });

  afterEach(() => {
    simple.restore(global, 'fetch');
  });

  it('constructs the proper url', () => {
    assert.equal(
      flightApi.urlFor('airlines'),
      'http://node.locomote.com/code-task/airlines'
    );
  });

  it('fetches airlines', (done) => {
    const mockedAirlines = [{
      code: 1,
      name: 'American Airlines'
    }];
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200,
      body: mockedAirlines
    });
    flightApi.fetchAirlines().then((airlines) => {
      assert.deepEqual(airlines, mockedAirlines);
      done();
    }).catch(done);
  });

  it('fetches airports', (done) => {
    const mockedAirports = [{
      name: 'Congonhas',
      city: 'São Paulo'
    }];
    fakeFetch.mockRequest(flightApi.urlFor('airports'), {
      status: 200,
      body: mockedAirports
    });
    flightApi.fetchAirports().then((airlines) => {
      assert.deepEqual(airlines, mockedAirports);
      done();
    }).catch(done);
  });

  it('searches for flights', (done) => {
    const mockedAirlines = [{
      code: 1,
      name: 'American Airlines'
    }, {
      code: 2,
      name: 'TAM'
    }];
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200,
      body: mockedAirlines
    });

    const AMFlights = {
      '2017-01-01': [
        { key: 1, price: 100 },
        { key: 2, price: 200 },
      ],
      '2017-01-02': [
        { key: 3, price: 50 }
      ],
      '2016-01-01': [
        { key: 4, price: 200 }
      ]
    };
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2017-01-01&from=a&to=b'),
      { status: 200, body: AMFlights['2017-01-01'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2017-01-02&from=a&to=b'),
      { status: 200, body: AMFlights['2017-01-02'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=2016-01-01&from=a&to=b'),
      { status: 200, body: AMFlights['2016-01-01'] }
    );

    const TAMFlights = {
      '2017-01-01': [
        { key: 5, price: 100 }
      ],
      '2017-01-02': [
        { key: 6, price: 200 },
        { key: 7, price: 50 }
      ],
      '2016-01-01': [
        { key: 8, price: 200 }
      ]
    };
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2017-01-01&from=a&to=b'),
      { status: 200, body: TAMFlights['2017-01-01'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2017-01-02&from=a&to=b'),
      { status: 200, body: TAMFlights['2017-01-02'] }
    );
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/2?date=2016-01-01&from=a&to=b'),
      { status: 200, body: TAMFlights['2016-01-01'] }
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
});
