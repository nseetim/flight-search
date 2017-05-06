import $ from 'jquery';
import 'jquery-validation';
import datesList from './components/dates-list';
import flightsList from './components/flights-list';
import { httpGet } from '../../../shared/http-client';
import * as dates from '../../../shared/util/dates';

import '../css/style.scss';

$.validator.addMethod('validDateStr', function validate(value, element) {
  return this.optional(element) || dates.isAValidDateStr(value);
}, 'Invalid format (YYYY-MM-DD)');

$.validator.addMethod('dateNotInThePast', function validate(value, element) {
  return this.optional(element) || !dates.isInThePast(new Date(value));
}, 'Date is in the past');


const searchForm = $('.search-form');
searchForm.validate({
  rules: {
    from: { required: true },
    to: { required: true },
    date: {
      required: true,
      validDateStr: true,
      dateNotInThePast: true
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

function searchFlights(from, to, datesToSearch, searchedDate) {
  setFormLoadingState(true);
  httpGet('/search', { from, to, dates: datesToSearch }).then((flights) => {
    setFormLoadingState(false);
    const elements = $(document.createDocumentFragment());
    const availDates = Object.keys(flights);

    let selectedDate = searchedDate;
    if (!flights[selectedDate]) {
      selectedDate = availDates[0];
    }
    elements.append(flightsList(flights[selectedDate]));
    elements.append(
      datesList(availDates, selectedDate, dateClicked.bind(null, flights))
    );
    $('#search-results').html(elements);
  }).catch((err) => {
    setFormLoadingState(false);
    let errMsg = '';
    if (err.status === 404) {
      errMsg = 'No flights found';
    } else if (err.status === 400 && err.details) {
      errMsg = err.details.message;
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

    const diff = dates.diffInDays(new Date(date), new Date());
    // Make sure we'll not request a date that's in the past
    const start = (diff <= 2 ? Math.max(0, diff - 1) : Math.min(diff, 2)) * -1;

    const datesToSearch = [1, 2, 3, 4, 5].map((days) => {
      const pl = (val) => {
        const str = `${val}`;
        return `${'00'.substring(0, 2 - str.length)}${str}`;
      };
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + (start + days));
      return `${pl(nextDate.getFullYear())}-${pl(nextDate.getMonth() + 1)}-${pl(nextDate.getDate())}`;
    });

    searchFlights(from, to, datesToSearch, date);
  }
});

searchForm.find('input')[0].focus();
