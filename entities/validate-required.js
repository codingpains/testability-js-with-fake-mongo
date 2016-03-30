'use strict';

module.exports = function(required, args) {
  args = args || {};
  let missing = required.filter((field) => !args[field]);
  return !missing.length;
};
