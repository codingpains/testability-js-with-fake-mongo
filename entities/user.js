'use strict';

const REQUIRED_FIELDS = ['username', 'name', 'role'];
const BadInputError = require('./../errors/bad-input');
const validFields = require('./validate-required');

class User {
  constructor(args) {
    args = args || {};
    if (!validFields(REQUIRED_FIELDS, args)) {
      throw new BadInputError(`${REQUIRED_FIELDS.join()} are required`);
    }
    Object.assign(this, args);
  }
}

module.exports = User;
