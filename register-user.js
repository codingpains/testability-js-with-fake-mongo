'use strict';

const async = require('async');
const BadInputError = require('./errors/bad-input');
const makeUser = require('./entities/user-factory');
const validFields = require('./entities/validate-required');

const REQUIRED_FIELDS = ['database', 'userData'];

class CantCreateUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CANT_CREATE_USER';
    Error.captureStackTrace(this, this.constructor);
  }
}

class RegisterUser {
  constructor(args) {
    args = args || {};
    if (!validFields(REQUIRED_FIELDS, args)) {
      throw new BadInputError('database is required');
    }
    Object.assign(this, args);
  }

  execute(callback) {
    async.waterfall([
      this._verifyUsername.bind(this),
      this._createUser.bind(this)
    ], callback);
  }

  _verifyUsername(callback) {
    const username = this.userData.username;
    this.database.findUserByUsername(username, (error, user) => {
      if (error) return callback(error);
      if (user) return callback(new CantCreateUserError(`username "${username}" already exists`));
      callback();
    });
  }

  _createUser(callback) {
    this.database.createUser(makeUser(this.userData), (error, user) => {
      if (error) return callback(new CantCreateUserError(error.message));
      callback(null, user);
    });
  }
}

module.exports = RegisterUser;
