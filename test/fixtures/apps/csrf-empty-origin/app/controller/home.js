'use strict';

exports.index = function* () {
  this.body = this.csrf;
};

exports.rotate = function* () {
  this.rotateCsrfSecret();
  this.body = this.csrf;
};

exports.update = function* () {
  this.session.body = this.request.body;
  this.body = this.request.body;
};
