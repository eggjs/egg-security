'use strict';

const methods = require('methods');

const safeHttpMethodsMap = {};
for (const method of methods) {
  if ([ 'trace', 'track', 'options' ].indexOf(method) === -1) {
    safeHttpMethodsMap[method.toUpperCase()] = true;
  }
}

// https://www.owasp.org/index.php/Cross_Site_Tracing
// 提高性能转换为map,测试对比：http://jsperf.com/find-by-map-with-find-by-array
module.exports = () => {
  return function* notAllow(next) {
    // this.method is upper case
    if (!safeHttpMethodsMap[this.method]) {
      this.throw(405);
    }
    yield next;
  };
};
