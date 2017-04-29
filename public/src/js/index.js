import $ from 'jquery';
import 'jquery-validation';
import datesList from './components/dates-list';
import flightsList from './components/flights-list';
import { httpGet } from '../../../app/shared/http-client';

import '../css/style.scss';

$.validator.addMethod('flightDate', function validate(value, element) {
  const date = new Date(value);
  const validFormat = /\d{4}-\d{2}-\d{2}/.test(value);
  const validDate = date.getTime() === date.getTime();
  return this.optional(element) || (validFormat && validDate);
}, 'Invalid date (YYYY-MM-DD)');

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

function dateClicked(flights, date) {
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

function searchFlights(from, to, dates) {
  setFormLoadingState(true);
  httpGet('/search', { from, to, dates }).then((flights) => {
    setFormLoadingState(false);
    const elements = $(document.createDocumentFragment());
    const availDates = Object.keys(flights);
    const selectedDate = availDates[0];

    elements.append(flightsList(flights[selectedDate]));
    elements.append(datesList(availDates, selectedDate, dateClicked.bind(null, flights)));
    $('#search-results').html(elements);
  }).catch((err) => {
    setFormLoadingState(false);
    let errMsg = '';
    if (err.status === 404) {
      errMsg = 'No flights found';
    } else {
      errMsg = 'There is something wrong with our servers. Please try again later.';
    }
    $('#search-results').html(`<h2 class="title is-4">${errMsg}</h2>`);
  });
}

searchForm.on('submit', () => {
  if (searchForm.valid()) {
    const from = searchForm.find('input[name="from"]').val();
    const to = searchForm.find('input[name="to"]').val();
    const date = searchForm.find('input[name="date"]').val();
    const dates = [-2, -1, 0, 1, 2].map((days) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + days);
      return `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;
    });
    searchFlights(from, to, dates);
  }
});

searchForm.find('input')[0].focus();
