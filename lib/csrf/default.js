'use strict';

const csrf = require('koa-csrf');

module.exports = function(app) {
  csrf(app);
};
