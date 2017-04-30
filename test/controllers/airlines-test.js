const assert = require('assert');
const support = require('../support');
const simple = require('simple-mock');
const flightApi = require('../../app/flight-api');
const fixtures = require('../fixtures');

const fakeFetch = support.fakeFetch;
const fakeServer = support.fakeServer;

describe('Controllers - Airlines', () => {
  beforeEach(() => {
    simple.mock(global, 'fetch', fakeFetch);
  });

  afterEach(() => {
    simple.restore(global, 'fetch');
    fakeFetch.restore();
  });

  it('responds to /airlines', (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 200, body: fixtures.airlines
    });
    fakeServer()
    .get('/airlines')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, resp) => {
      assert.equal(err, null);
      assert.deepEqual(resp.body, fixtures.airlines);
      done();
    });
  });

  it("handles flight-api's errors correctly", (done) => {
    fakeFetch.mockRequest(flightApi.urlFor('airlines'), {
      status: 500,
      body: 'Server error'
    });
    fakeServer()
    .get('/airlines')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(500)
    .end(done);
  });
});
