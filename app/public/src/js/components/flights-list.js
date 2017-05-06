import $ from 'jquery';

function durationDisplay(timeInMinutes) {
  let displayStr = '';
  const hours = Math.floor(timeInMinutes / 60);
  if (hours > 0) {
    displayStr = `${hours}h `;
  }
  const minutes = timeInMinutes % 60;
  return `${displayStr}${minutes}min`;
}

function timeDisplay(dateTime) {
  const pl = (val) => {
    const str = `${val}`;
    return `${'00'.substring(0, 2 - str.length)}${str}`;
  };
  return `${pl(dateTime.getHours())}:${pl(dateTime.getMinutes())}`;
}

export default function render(flights) {
  const ul = $('<ul>', { class: 'flights-list' });
  flights.sort((a, b) => a.price - b.price).forEach((flight) => {
    const li = `
      <li class="columns is-mobile">
        <div class="column is-9">
          <h3 class="flights-list__flight-title">${flight.airline.name} <small> ( Flight num ${flight.flightNum} ) </small></h3>
          <div class="columns">
            <div class="column">
              <p class="label">Departure</p>
              <strong>${timeDisplay(new Date(flight.start.dateTime))}</strong> - ${flight.start.airportName}
            </div>
            <div class="column">
              <p class="label">Arrival</p>
              <strong>${timeDisplay(new Date(flight.finish.dateTime))}</strong> - ${flight.finish.airportName}
            </div>
          </div>
        </div>
        <div class="column is-3 has-text-right">
          <h2 class="flights-list__flight-price">$${flight.price}</h2>
          <p class="label">Duration</p>
          <p><strong>${durationDisplay(flight.durationMin)}</strong></p>
        </div>
      </li>
      <hr />`;

    ul.append($(li));
  });
  return ul;
}

