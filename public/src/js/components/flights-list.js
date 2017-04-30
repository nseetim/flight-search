import $ from 'jquery';

function displayTime(timeInMinutes) {
  let displayStr = '';
  const hours = Math.floor(timeInMinutes / 60);
  if (hours > 0) {
    displayStr = `${hours}h `;
  }
  const minutes = timeInMinutes % 60;
  return `${displayStr}${minutes}min`;
}

export default function render(flights) {
  const ul = $('<ul>', { class: 'flights-list' });
  flights.forEach((flight) => {
    const li = `
      <li class="columns is-mobile">
        <div class="column is-9">
          <h3 class="flights-list__flight-title">${flight.airline} <small>(${flight.seatType})</small></h3>
          <div class="columns">
            <div class="column">
              <p class="label">Departure</p>
              <strong>${flight.departure.time}</strong> ${flight.departure.airport}
            </div>
            <div class="column">
              <p class="label">Arrival</p>
              <strong>${flight.arrival.time}</strong> ${flight.arrival.airport}
            </div>
          </div>
        </div>
        <div class="column is-3 has-text-right">
          <h2 class="flights-list__flight-price">$${flight.price}</h2>
          <p class="label">Flight Time</p>
          <p><strong>${displayTime(flight.totalTime)}</strong></p>
        </div>
      </li>
      <hr />`;

    ul.append($(li));
  });
  return ul;
}

