const flightApi = require('../flight-api');

module.exports = (app) => {
  app.use('/search', (req, res, next) => {
    const from = req.query.from;
    const to = req.query.to;
    const dates = req.query.dates;
    flightApi.searchFlights(dates, from, to).then((flights) => {
      res.json(flights);
    }).catch(next);
  });
};
