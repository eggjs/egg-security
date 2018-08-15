'use strict';

/**
 * remote command execution
 */

const BASIC_ALPHABETS = new Set('abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.-_'.split(''));

function cliFilter(string) {

  const str = '' + string;
  let res = '';
  let ascii;

  for (let index = 0; index < str.length; index++) {
    ascii = str[index];
    if (BASIC_ALPHABETS.has(ascii)) {
      res += ascii;
    }
  }

  return res;

}
module.exports = cliFilter;
