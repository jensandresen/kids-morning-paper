const mocha = require("mocha");
const { assert } = require("chai");
const moment = require("moment");

const sut = require("../date-utils");

describe("date utils", function () {
  describe("overlaps", function () {
    it("returns expected if other events is empty", function () {
      const start = moment().toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = { id: 1, start: start, end: end };

      const result = sut.overlaps(stubEvent, []);

      assert.lengthOf(result, 0);
    });

    it("returns expected if other events only contains the input event", function () {
      const start = moment().toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = { id: 1, start: start, end: end };

      const result = sut.overlaps(stubEvent, [stubEvent]);

      assert.deepEqual(result, [stubEvent]);
    });

    it("returns expected if other events only contains a full day event", function () {
      const start = moment().toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = { id: 1, start: start, end: end };
      const stubFullDayEvent = {
        id: 2,
        start: moment(start).startOf("day").toDate(),
        end: moment(start).endOf("day").toDate(),
      };

      const result = sut.overlaps(stubEvent, [stubFullDayEvent]);

      assert.deepEqual(result, [stubFullDayEvent]);
    });

    it("returns expected if other events contains event with start within input event time frame", function () {
      const start = moment("2000-01-01 12:00").toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = { id: 1, start: start, end: end };
      const stub30MinOffsetEvent = {
        id: "wanted",
        start: moment(start).add(30, "minutes").toDate(),
        end: moment(end).add(30, "minutes").toDate(),
      };

      const notTargetedEvent = {
        id: "not-this-one",
        start: moment(start).subtract(5, "hours").toDate(),
        end: moment(start).subtract(4, "hours").toDate(),
      };

      const result = sut.overlaps(stubEvent, [
        notTargetedEvent,
        stub30MinOffsetEvent,
      ]);

      assert.deepEqual(result, [stub30MinOffsetEvent]);
    });

    it("returns expected if other events are just succeeding", function () {
      const start = moment.utc("2000-01-01 12:00").toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = {
        id: 1,
        start: start,
        end: end,
      };

      const succeedingEventStub = {
        id: "not-wanted",
        start: moment(end).toDate(),
        end: moment(end).add(1, "hour").toDate(),
      };

      const result = sut.overlaps(stubEvent, [succeedingEventStub]);
      assert.deepEqual(result, []);
    });

    it("returns expected if other events are just precceeding", function () {
      const start = moment.utc("2000-01-01 12:00").toDate();
      const end = moment(start).add(1, "hour").toDate();

      const stubEvent = {
        id: 1,
        start: start,
        end: end,
      };

      const precceedingEventStub = {
        id: "not-wanted",
        start: moment(start).subtract(1, "hour").toDate(),
        end: moment(start).toDate(),
      };

      const result = sut.overlaps(stubEvent, [precceedingEventStub]);
      assert.deepEqual(result, []);
    });
  });

  describe("sortByDate", function () {
    it("returns expected when input is an empty list", function () {
      const result = sut.sortByStart([]);
      assert.deepEqual(result, []);
    });

    it("returns expected when input has one item", function () {
      const start = moment("2000-01-01 12:00").toDate();
      const end = moment(start).add(1, "hour").toDate();
      const stubEvent = { id: 1, start: start, end: end };

      const result = sut.sortByStart([stubEvent]);
      assert.deepEqual(result, [stubEvent]);
    });

    it("returns expected when input has two items at different times", function () {
      const start = moment("2000-01-01 12:00").toDate();
      const end = moment(start).add(1, "hour").toDate();
      const earlyEventStub = { id: "early", start: start, end: end };

      const lateEventStub = {
        id: "late",
        start: moment(end).add(1, "hour").toDate(),
        end: moment(end).add(2, "hour").toDate(),
      };

      const result = sut.sortByStart([lateEventStub, earlyEventStub]);

      assert.deepEqual(result, [earlyEventStub, lateEventStub]);
    });
  });
});
