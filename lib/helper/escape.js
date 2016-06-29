'use strict';

// 一般模板引擎有自带的 escape 实现，并不会用到这个。但是如果模板引擎没有注入，则注入这个 helper。
module.exports = require('escape-html');
