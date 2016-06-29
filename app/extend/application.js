'use strict';

exports.injectCsrf = function(tmplStr) {

  const input_csrf = '<input type="hidden" name="_csrf" value="{{ctx.csrf}}" />';

  tmplStr = tmplStr.replace(/(<form.*?>)([\s\S]*?)<\/form>/gi, function(_, $1, $2) {
    const match = $2;
    if (match.indexOf('name="_csrf"') !== -1 || match.indexOf('name=\'_csrf\'') !== -1) {
      return $1 + match + '</form>';
    }
    return $1 + match + '\r\n' + input_csrf + '</form>';
  });

  return tmplStr;
};

exports.injectNonce = function(tmplStr) {
  tmplStr = tmplStr.replace(/<script(.*?)>([\s\S]*?)<\/script>/gi, function(_, $1, $2) {
    if ($1.indexOf('nonce=') === -1) {
      $1 += ' nonce="{{ctx.nonce}}"';
    }

    return '<script' + $1 + '>' + $2 + '</script>';
  });

  return tmplStr;
};

exports.injectHijackingDefense = function(tmplStr) {
  const defence = '<!--for injection--><!--</html>--><!--for injection-->';
  tmplStr = defence + tmplStr + defence;
  return tmplStr;
};
