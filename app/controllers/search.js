const flightApi = require('../flight-api');
const errors = require('../errors');

module.exports = (app) => {
  app.use('/search', (req, res, next) => {
    const from = req.query.from;
    const to = req.query.to;
    const dates = req.query.dates;

    if (!from || !to || !dates) {
      throw errors.WebApplicationError(400, 'Parameters from, to and dates are required');
    }

    flightApi.searchFlights(dates.split(','), from, to).then((flights) => {
      if (Object.keys(flights).length === 0) {
        throw errors.WebApplicationError(404, 'No Flights found');
      }
      res.json(flights);
    }).catch(next);
  });
};
