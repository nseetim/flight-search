const flightApi = require('../flight-api');
const errors = require('../errors');

module.exports = (app) => {
  app.use('/airports', (req, res, next) => {
    const query = req.query.q;
    if (!query) {
      throw errors.WebApplicationError(400, 'The query param "q" is required');
    }
    flightApi.fetchAirports(query).then((airports) => {
      res.json(airports);
    }).catch(next);
  });
};
