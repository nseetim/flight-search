const flightApi = require('../flight-api');

module.exports = (app) => {
  app.use('/airports', (req, res, next) => {
    flightApi.fetchAirports().then((airports) => {
      res.json(airports);
    }).catch(next);
  });
};
