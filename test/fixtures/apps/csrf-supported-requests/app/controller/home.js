exports.index = async function() {
  this.body = this.csrf;
};

exports.rotate = async function() {
  this.rotateCsrfSecret();
  this.body = this.csrf;
};

exports.update = async function() {
  this.session.body = this.request.body;
  this.body = this.request.body;
};
