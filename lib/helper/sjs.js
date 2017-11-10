'use strict';

/**
 * Escape JavaScript to \xHH format
 */

// escape \x00-\x7f
// except 0-9,A-Z,a-z(\x2f-\x3a \x40-\x5b \x60-\x7b)

// eslint-disable-next-line
const matchVulnerableRegExp = /[\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]/;
// eslint-enable-next-line

const map = {
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
};

function escapeJavaScript(string) {

  const str = '' + string;
  const match = matchVulnerableRegExp.exec(str);

  if (!match) {
    return str;
  }

  let res = '';
  let index = 0;
  let lastIndex = 0;
  let ascii;

  for (index = match.index; index < str.length; index++) {
    ascii = str[index];
    if ('abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(ascii) !== -1) {
      continue;
    } else {
      if (map[ascii] === undefined) {
        const code = ascii.charCodeAt(0);
        if (code > 127) {
          continue;
        } else {
          map[ascii] = '\\x' + code.toString(16);
        }
      }
    }

    if (lastIndex !== index) {
      res += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    res += map[ascii];
  }

  return lastIndex !== index ? res + str.substring(lastIndex, index) : res;

}

module.exports = escapeJavaScript;
