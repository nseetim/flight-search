import $ from 'jquery';
import 'jquery-validation';
import datesList from './components/dates-list';
import flightsList from './components/flights-list';
import flights from './fixtures';

import '../css/style.scss';

$.validator.addMethod('flightDate', function validate(value, element) {
  const date = new Date(value);
  const validFormat = /\d{2}-\d{2}-\d{4}/.test(value);
  const validDate = date.getTime() === date.getTime();
  return this.optional(element) || (validFormat && validDate);
}, 'Invalid date (MM-DD-YYYY)');

const searchForm = $('.search-form');
searchForm.validate({
  rules: {
    from: { required: true },
    to: { required: true },
    date: {
      required: true,
      flightDate: true
    }
  }
});

function dateClicked(date) {
  const element = $('#search-results .flights-list');
  element.fadeOut(200, () => {
    element.remove();
    const newElement = flightsList(flights[date]);
    newElement.css({ display: 'none' });
    newElement.insertBefore('#search-results .dates-list');
    newElement.fadeIn(200);
  });
}

function setFormLoadingState(loading) {
  const fn = loading ? 'addClass' : 'removeClass';
  searchForm.find('.overlay')[fn]('visible');
  searchForm.find('.button')[fn]('is-loading');
}

searchForm.on('submit', () => {
  if (searchForm.valid()) {
    setFormLoadingState(true);

    setTimeout(() => {
      setFormLoadingState(false);
      const elements = $(document.createDocumentFragment());
      const dates = Object.keys(flights);
      const selectedDate = dates[0];

      elements.append(flightsList(flights[selectedDate]));
      elements.append(datesList(dates, selectedDate, dateClicked));
      $('#search-results').html(elements);
    }, 1000);
  }
});

searchForm.find('input')[0].focus();
