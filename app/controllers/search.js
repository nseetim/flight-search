const flightApi = require('../flight-api');
const errors = require('../errors');
const { isAValidDateStr, isInThePast } = require('../shared/util/dates');

function validateDates(dates) {
  dates.forEach((date) => {
    if (!isAValidDateStr(date)) {
      throw errors.WebApplicationError(400, `Date ${date} is invalid`);
    }
    if (isInThePast(new Date(date))) {
      throw errors.WebApplicationError(400, `Date ${date} is in the past`);
    }
  });
}

module.exports = (app) => {
  app.use('/search', (req, res, next) => {
    const from = req.query.from;
    const to = req.query.to;
    const dates = req.query.dates;

    if (!from || !to || !dates) {
      throw errors.WebApplicationError(400, 'Parameters from, to and dates are required');
    }

    const dateArr = dates.split(',');
    validateDates(dateArr);

    flightApi.searchFlights(dateArr, from, to).then((flights) => {
      if (Object.keys(flights).length === 0) {
        throw errors.WebApplicationError(404, 'No Flights found');
      }
      res.json(flights);
    }).catch(next);
  });
};
