'use strict';

require('should');

module.exports = function(app) {

  app.get('/escapeShellArg', function*() {

    const port = '8889|chmod 777 /tmp/muma.sh;';
    this.body = `cp.exec('./start.sh '+${this.helper.escapeShellArg(port)})` === 'cp.exec(\'./start.sh \'+\'8889|chmod 777 /tmp/muma.sh;\')';
  });

  app.get('/escapeShellArg-2', function*() {
    const port = '8889\'|chmod 777 /tmp/muma.sh;echo \\';
    this.body = `cp.exec('./start.sh '+${this.helper.escapeShellArg(port)})` === 'cp.exec(\'./start.sh \'+\'8889\\\'|chmod 777 /tmp/muma.sh;echo \\\\\')';
  });

  app.get('/escapeShellArg-3', function*() {
    const port = '8889';
    this.body = `${this.helper.escapeShellArg(port)}` === '\'8889\'';
  });


};
