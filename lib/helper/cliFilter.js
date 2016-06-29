'use strict';

/**
 * 用于远程命令执行漏洞的防范
 * 如果用户可控变量为命令中的参数。则直接使用安全包函数过滤。
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
