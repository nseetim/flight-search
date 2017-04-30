const assert = require('assert');
const support = require('../support');
const simple = require('simple-mock');
const flightApi = require('../../app/flight-api');
const fixtures = require('../fixtures');

const fakeFetch = support.fakeFetch;
const fakeServer = support.fakeServer;

describe('Controllers - Airports', () => {
  beforeEach(() => {
    simple.mock(global, 'fetch', fakeFetch);
  });

  afterEach(() => {
    simple.restore(global, 'fetch');
    fakeFetch.restore();
  });

  it('responds to /airports', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 200, body: fixtures.airports
    });
    fakeServer()
    .get('/airports')
    .query({ q: 'São Paulo' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, resp) => {
      assert.equal(err, null);
      assert.deepEqual(resp.body, fixtures.airports);
      done();
    });
  });

  it("handles flight-api's errors correctly", (done) => {
    fakeFetch.mockRequest(flightApi.urlFor(`airports?q=${encodeURIComponent('São Paulo')}`), {
      status: 500, body: 'error'
    });
    fakeServer()
    .get('/airports')
    .query({ q: 'São Paulo' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(500)
    .end(done);
  });

  it("returns 400 when the query parameter 'q' is not provided", (done) => {
    fakeServer()
    .get('/airports')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .end(done);
  });
});
