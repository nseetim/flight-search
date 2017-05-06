/**
 * Validates if the given text is a valid date for the flight search
 * api. A valid date has the following format (YYYY-DD-MM).
 * @param {string} dateStr the string to validate
 *
 * @returns {boolean} true if valid, false otherwise.
 */
function isAValidDateStr(dateStr) {
  const date = new Date(dateStr);
  const validFormat = /\d{4}-\d{2}-\d{2}/.test(dateStr);
  const validDate = date.getTime() === date.getTime();
  return validFormat && validDate;
}

/**
 * Returns the difference in days between `a` and `b`.
 *
 * @param {date} a a date object
 * @param {date} b a date object
 */
function diffInDays(a, b) {
  const oneDayMs = 86400000;
  const diff = a.getTime() - b.getTime();
  return Math.ceil(diff / oneDayMs);
}

/**
 * Checks if the given date is in the past.
 * Only the date portion is considered, time is ignored.
 *
 * @param {date} date the date to check
 *
 * @returns {boolean} true if is in the past, false otherwise.
 */
function isInThePast(date) {
  return diffInDays(date, new Date()) <= 0;
}

module.exports = {
  isAValidDateStr,
  isInThePast,
  diffInDays
};
