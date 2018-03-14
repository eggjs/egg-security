'use strict';

exports.safeRedirect = function* () {
  const goto = this.query.goto;
  console.log('%j, %s', goto, goto);
  this.redirect(goto);
};

exports.unSafeRedirect = function* () {
  const goto = this.query.goto;
  this.unsafeRedirect(goto);
};
