const moment = require("moment");

const isAtSameTime = (e1, e2) =>
  e1.start.getTime() == e2.start.getTime() &&
  e1.end.getTime() == e2.end.getTime();

const isWithinOther = (e, other) =>
  e.start.getTime() >= other.start.getTime() &&
  e.end.getTime() <= other.end.getTime();

const hasStartWithinOther = (e, other) =>
  e.start.getTime() >= other.start.getTime() &&
  e.start.getTime() <= other.end.getTime();

const hasEndWithinOther = (e, other) =>
  e.end.getTime() >= other.start.getTime() &&
  e.end.getTime() <= other.end.getTime();

const isJustAfter = (e, other) =>
  e.start.getTime() == other.end.getTime() &&
  e.end.getTime() > other.end.getTime();

const isJustBefore = (e, other) => {
  return (
    e.start.getTime() < other.start.getTime() &&
    e.end.getTime() == other.start.getTime()
  );
};

exports.sortByStart = function sortByStart(events) {
  return [...events].sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
};

exports.overlaps = function overlaps(event, otherEvents) {
  return otherEvents.filter((other) => {
    if (isJustBefore(event, other) || isJustAfter(event, other)) {
      return false;
    }

    return (
      isAtSameTime(event, other) ||
      isWithinOther(event, other) ||
      isWithinOther(other, event) ||
      hasStartWithinOther(event, other) ||
      hasStartWithinOther(other, event) ||
      hasEndWithinOther(event, other) ||
      hasEndWithinOther(other, event)
    );
  });
};

export default {};
