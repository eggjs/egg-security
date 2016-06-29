'use strict';

require('should');

module.exports = function(app) {

  app.get('/safepath', function*() {
    const foo = '1.jpg';
    this.body = `var foo = "${this.helper.spath(foo)}";` === 'var foo = "1.jpg";';
  });

  app.get('/unsafepath', function*() {
    const foo2 = '../home/admin'
    this.body = `${this.helper.spath(foo2)}`==='null';
  });

  app.get('/unsafepath2', function*() {
    const foo2 = '/usr/local/bin'
    this.body = `${this.helper.spath(foo2)}`==='null';
  });

  app.get('/unsafepath3', function*() {
    const foo3 = '%2Fusr%2Flocal%2Fbin'
    this.body = `${this.helper.spath(foo3)}`==='null';
  });

  app.get('/unsafepath4', function*() {
    const foo4 = '%252Fusr%252Flocal%252Fbin'
    this.body = `${this.helper.spath(foo4)}`==='null';
  });

  app.get('/unsafepath5', function*() {
    const foo5 = '%hello'
    this.body = `${this.helper.spath(foo5)}`==='%hello';
  });

  app.get('/unsafepath6', function*() {
    const foo6 = {file:"abc"}
    this.body = `${this.helper.spath(foo6)}`==='[object Object]';
  });

  app.get('/unsafepath7', function*() {
    const foo7 = '%24_a.js'
    this.body = `${this.helper.spath(foo7)}`==='%24_a.js';
  });
};
