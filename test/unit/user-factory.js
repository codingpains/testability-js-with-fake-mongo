'use strict';

const test = require('tape');
const makeUser = require('./../../entities/user-factory');

test('User Factory - should throw error if bad data', (assert) => {
  try {
    makeUser({});
  } catch (error) {
    assert.equal(error.name, 'CANT_MAKE_USER');
  }

  try {
    makeUser();
  } catch (error) {
    assert.equal(error.name, 'CANT_MAKE_USER');
  }

  assert.end();
});
