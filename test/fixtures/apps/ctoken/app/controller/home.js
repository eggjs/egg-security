'use strict';

exports.index = function*() {
  this.body = {
    method: this.method,
    url: this.url,
    body: this.request.body,
    ctoken: this.getCookie('ctoken'),
  };
};

exports.update = function*() {
  this.body = this.request.body;
};

exports.localhost = function*() {
  this.body = this.ctoken;
}
