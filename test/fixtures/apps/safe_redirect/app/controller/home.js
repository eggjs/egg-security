'use strict';

exports.safeRedirect = function* () {
  const goto = this.query.goto;
  console.log(goto);
  this.redirect(goto);
};

exports.unSafeRedirect = function* () {
  const goto = this.query.goto;
  this.unsafeRedirect(goto);
};
