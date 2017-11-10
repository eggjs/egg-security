'use strict';

/**
 * remote command execution
 */

function cliFilter(string) {

  const str = '' + string;
  let res = '';
  let ascii;

  for (let index = 0; index < str.length; index++) {
    ascii = str[index];
    if ('abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.-_'.indexOf(ascii) !== -1) {
      res += ascii;
    }
  }

  return res;

}
module.exports = cliFilter;
