const Decimal = require("decimal.js");
const toDecimal = (value) => {
  return new Decimal(value);
};

const isEqual = (value1, value2) => {
  return toDecimal(value1).eq(toDecimal(value2));
};

const isGreaterThanOrEqual = (value1, value2) => {
  return toDecimal(value1).gte(toDecimal(value2));
};

const isGreaterThan = (value1, value2) => {
  return toDecimal(value1).gt(toDecimal(value2));
};

const isLowerThanOrEqual = (value1, value2) => {
  return toDecimal(value1).lte(toDecimal(value2));
};

const isLowerThan = (value1, value2) => {
  return toDecimal(value1).lt(toDecimal(value2));
};

module.exports = {
  isEqual,
  isGreaterThan,
  isGreaterThanOrEqual,
  isLowerThanOrEqual,
  isLowerThan,
};
