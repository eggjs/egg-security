'use strict';

const methods = require('methods');
const safeHttpMethods = methods.filter(function(m) {
  return [ 'trace', 'track', 'options' ].indexOf(m) === -1;
});

const safeHttpMethodsMap = {};

safeHttpMethods.forEach(function(d) {
  safeHttpMethodsMap[d] = true;
});

// https://www.owasp.org/index.php/Cross_Site_Tracing
// 提高性能转换为map,测试对比：http://jsperf.com/find-by-map-with-find-by-array
module.exports = function() {
  return function* notallow(next) {
    if (!safeHttpMethodsMap[this.method.toLowerCase()]) {
      this.throw(405);
    }
    yield next;
  };
};
