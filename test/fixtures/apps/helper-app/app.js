'use strict';
const assert = require('assert');

module.exports = app => {
  const helper = app.createAnonymousContext().helper;
  assert(!helper.surl('foo://foo/bar'));
};
