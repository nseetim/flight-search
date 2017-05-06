import $ from 'jquery';

export default function render(dates, selectedDate, onClick) {
  const ul = $('<ul>', { class: 'dates-list' });
  dates.sort((a, b) => a > b).forEach((date) => {
    const a = $('<a>', { href: '#', text: date });
    a.on('click', function onDateClick(e) {
      e.preventDefault();
      ul.find('li').removeClass('dates-list__selected');
      $(this).parent().addClass('dates-list__selected');
      onClick(date);
    });
    ul.append($('<li>', {
      class: selectedDate === date ? 'dates-list__selected' : ''
    }).append(a));
  });
  return ul;
}
