const dates = require('../../../app/shared/util/dates');
const assert = require('assert');

describe('Utils - Dates', () => {
  describe('isAValidDateStr', () => {
    it('returns false for wrong formatted dates', () => {
      assert.equal(dates.isAValidDateStr('2017-'), false);
      assert.equal(dates.isAValidDateStr('01-01-2017'), false);
      assert.equal(dates.isAValidDateStr('01-01-17'), false);
      assert.equal(dates.isAValidDateStr('2017-011-17'), false);
    });

    it('returns false for invalid dates', () => {
      assert.equal(dates.isAValidDateStr('2017-31-01'), false);
      assert.equal(dates.isAValidDateStr('2017-01-40'), false);
    });

    it('returns true for valid dates', () => {
      assert.equal(dates.isAValidDateStr('2017-01-01'), true);
      assert.equal(dates.isAValidDateStr('2017-05-28'), true);
    });
  });

  describe('isInThePast', () => {
    it('returns true when date is in the past', () => {
      assert.equal(dates.isInThePast(new Date('2017-01-01')), true);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      assert.equal(dates.isInThePast(yesterday), true);
      assert.equal(dates.isInThePast(new Date()), true);
    });

    it('returns true when date is not in the past', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      assert.equal(dates.isInThePast(tomorrow), false);
    });
  });

  describe('diffInDays', () => {
    it('returns the difference in days between two dates', () => {
      assert.equal(dates.diffInDays(
        new Date('2017-01-01'),
        new Date('2017-01-01')),
      0);
      assert.equal(dates.diffInDays(
        new Date(),
        new Date()),
      0);
      assert.equal(dates.diffInDays(
        new Date('2017-01-01'),
        new Date('2017-01-02')),
      -1);
      assert.equal(dates.diffInDays(
        new Date('2017-01-06'),
        new Date('2017-01-02')),
      4);
    });
  });
});

