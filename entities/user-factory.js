'use strict';

const User = require('./user');

class CantMakeUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CANT_MAKE_USER';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = function(userData) {
  try {
    return new User(userData);
  } catch (error) {
    throw new CantMakeUserError(`failed to make user: ${error.message}`);
  }
};
