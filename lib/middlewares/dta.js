'use strict';

// https://en.wikipedia.org/wiki/Directory_traversal_attack
const isSafePath = require('../utils').isSafePath;

module.exports = () => {
  return function* dta(next) {
    const path = this.path;
    if (!isSafePath(path, this)) {
      this.throw(400);
    }
    yield next;
  };
};
