const assert = require('assert');
const support = require('../support');
const simple = require('simple-mock');
const flightApi = require('../../app/flight-api');
const fixtures = require('../fixtures');

const fakeFetch = support.fakeFetch;
const fakeServer = support.fakeServer;

describe('Controllers - Search', () => {
  beforeEach(() => {
    simple.mock(global, 'fetch', fakeFetch);
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 200, body: fixtures.airports['São Paulo']
    });
    fakeFetch.mockRequest(flightApi.urlFor('airports?q=Chicago'), {
      status: 200, body: fixtures.airports.Chicago
    });
  });

  afterEach(() => {
    simple.restore(global, 'fetch');
    fakeFetch.restore();
  });

  it('responds to /search', (done) => {
    fakeFetch.mockRequest(
      flightApi.urlFor('flight_search/1?date=9999-01-01&from=ORD&to=CGH'),
      { status: 200, body: fixtures.flights['1']['9999-01-01']['ORD-CGH'] }
    );
    fakeServer()
    .get('/search')
    .query({ from: 'Chicago', to: 'São Paulo', dates: '9999-01-01,9999-01-02' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, resp) => {
      assert.equal(err, null);
      assert.deepEqual(resp.body, {
        '9999-01-01': [
          { key: 1, price: 100 },
          { key: 2, price: 200 },
        ]
      });
      done();
    });
  });

  it("handles flight-api's errors correctly", (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 500,
      body: 'Server error'
    });
    fakeServer()
    .get('/search')
    .query({ from: 'a', to: 'b', dates: '9999-01-01,9999-01-02' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(500)
    .end(done);
  });

  it('returns 404 when no flights are found', (done) => {
    fakeServer()
    .get('/search')
    .query({ from: 'a', to: 'b', dates: '9999-01-01,9999-01-02' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
    .end(done);
  });

  describe('when invalid parameters are provided', () => {
    const doRequest = (params) => {
      return fakeServer()
      .get('/search')
      .query(params)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
    };

    it('returns 400 when to, from or dates are missing', (done) => {
      Promise.all([
        doRequest({ from: 'a' }),
        doRequest({ to: 'b' }),
        doRequest({ from: 'a', to: 'b' }),
        doRequest({ from: 'a', dates: '9999-01-01' }),
        doRequest({ to: 'a', dates: '9999-01-01' }),
        doRequest({ dates: '9999-01-01' })
      ])
      .then(() => done())
      .catch(done);
    });

    it('returns 400 when an invalid date is provided', (done) => {
      Promise.all([
        doRequest({ from: 'a', to: 'b', dates: '201701-01,9999-01-01' }),
        doRequest({ from: 'a', to: 'b', dates: '9999-40-01,9999-01-01' })
      ])
      .then(() => done())
      .catch(done);
    });

    it('returns 400 when a date in the past is provided', (done) => {
      Promise.all([
        doRequest({ from: 'a', to: 'b', dates: '2017-01-01,9999-01-01' }),
        doRequest({ from: 'a', to: 'b', dates: '9999-01-01,9999-01-01,2010-01-01' })
      ])
      .then(() => done())
      .catch(done);
    });
  });
});
