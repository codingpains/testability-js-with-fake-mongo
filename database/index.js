'use strict';

const mongo = require('mongodb').MongoClient;
const config = require('./../config');
const BadInputError = require('./../errors/bad-input');
const makeUser = require('./../entities/user-factory');
const toPlainObject = require('lodash/toPlainObject');

class DatbaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DATABASE_ERROR';
    Error.captureStackTrace(this, this.constructor);
  }
}

class MongoDatabase {
  constructor() {
    this._db = null;
  }

  findUserByUsername(username, callback) {
    this._getConnection((error, db) => {
      if (error) return callback(error);
      db.collection('users').findOne({username: username}, (error, record) => {
        if (error) return callback(new DatbaseError(error.message));
        if (!record) return callback(null, null);
        try {
          callback(null, makeUser(record));
        } catch (error) {
          callback(error);
        }
      });
    });
  }

  createUser(user, callback) {
    const userData = Object.assign({}, toPlainObject(user));
    this._getConnection((error, db) => {
      if (error) return callback(error);

      db.collection('users').insert(userData, (error, writeConcern) => {
        if (error) return callback(new DatbaseError(error.message));
        try {
          callback(null, makeUser(userData));
        } catch (error) {
          callback(error);
        }
      });
    });
  }

  _getConnection(callback) {
    if (this._db) return callback(null, this._db);
    mongo.connect(config.getMongoConnectionString(), (error, db) => {
      if (error) return callback(new DatbaseError(error.message));
      this._setConnection(db);
      callback(null, this._db);
    });
  }

  _setConnection(db) {
    if (!db) throw new BadInputError('mongodb connection is required');
    this._db = db;
  }
}

module.exports = MongoDatabase;
