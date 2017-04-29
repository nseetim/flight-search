const flightApi = require('../flight-api');

module.exports = (app) => {
  app.use('/airlines', (req, res, next) => {
    flightApi.fetchAirlines().then((airlines) => {
      res.json(airlines);
    }).catch(next);
  });
};
