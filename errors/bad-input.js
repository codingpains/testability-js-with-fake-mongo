'use strict';

class BadInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BAD_INPUT';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BadInputError;
