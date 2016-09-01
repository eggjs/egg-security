'use strict';

const csrf = require('koa-csrf');

module.exports = app => {
  csrf(app);
};
