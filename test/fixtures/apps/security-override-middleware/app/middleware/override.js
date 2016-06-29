module.exports = (options, app) => {
  return function*(next) {
    delete this.response.header['Strict-Transport-Security'];
    delete this.response.header['X-Download-Options'];
    delete this.response.header['X-Content-Type-Options'];
    delete this.response.header['X-XSS-Protection'];
    yield next;
    delete this.response.header['Strict-Transport-Security'];
    delete this.response.header['X-Download-Options'];
    delete this.response.header['X-Content-Type-Options'];
    delete this.response.header['X-XSS-Protection'];
  };
};
