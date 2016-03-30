'use strict';

const test = require('tape');
const async = require('async');
const proxyquire = require('proxyquire');
const get = require('lodash/get');
const RegisterUser = require('./../../register-user');
const usersFixture = require('./../fixtures/users.json');
const FakeMongo = require('fake-mongo');

FakeMongo['@global'] = true;
FakeMongo['@noCallThru'] = true;

const Database = proxyquire('./../../database/', {
  'mongodb': FakeMongo
});

const makeDatabase = function(callback) {
  let db = new Database();
  async.each(usersFixture, (userData, next) => {
    db.createUser(userData, next);
  }, (error) => {
    if (error) return callback(error);
    callback(null, db);
  });
};

test('RegisterUser - should return error if incomplete input', (assert) => {
  let expected = 'BAD_INPUT';
  let controller = null;
  let actual;
  try {
    controller = new RegisterUser();
  } catch (error) {
    actual = error.name;
  }

  assert.equal(null, controller);
  assert.equal(expected, actual);
  assert.end();
});

test('RegisterUser - should create new user', (assert) => {
  makeDatabase((error, db) => {
    assert.equal(error, null);
    let controller = new RegisterUser({
      database: db,
      userData: {
        name: 'John Doe',
        username: 'johndoe',
        role: 'admin'
      }
    });

    controller.execute((error, user) => {
      assert.equal(error, null);
      assert.equal(user.name, 'John Doe');
      assert.end();
    });
  });
});

test('RegisterUser - should return error if username is taken', (assert) => {
  makeDatabase((error, db) => {
    assert.equal(error, null);
    let controller = new RegisterUser({
      database: db,
      userData: {
        name: 'John Doe',
        username: 'codingpains',
        role: 'admin'
      }
    });

    controller.execute((error, user) => {
      assert.equal(get(error, 'name'), 'CANT_CREATE_USER');
      assert.end();
    });
  });
});

test('RegisterUser - should return error if db findUserByUsername gives error', (assert) => {
  makeDatabase((error, db) => {
    assert.equal(error, null);

    db.findUserByUsername = function(username, callback) {
      let error = new Error('Mock error');
      error.name = 'MOCK_ERROR';
      return callback(error);
    };

    let controller = new RegisterUser({
      database: db,
      userData: {
        name: 'John Doe',
        username: 'codingpains',
        role: 'admin'
      }
    });

    controller.execute((error, user) => {
      assert.equal(get(error, 'name'), 'MOCK_ERROR');
      assert.end();
    });
  });
});

test('RegisterUser - should return error if db createUser gives error', (assert) => {
  makeDatabase((error, db) => {
    assert.equal(error, null);

    db.createUser = function(user, callback) {
      let error = new Error('Mock error');
      return callback(error);
    };

    let controller = new RegisterUser({
      database: db,
      userData: {
        name: 'John Doe',
        username: 'johndoe',
        role: 'admin'
      }
    });

    controller.execute((error, user) => {
      assert.equal(get(error, 'name'), 'CANT_CREATE_USER');
      assert.end();
    });
  });
});
