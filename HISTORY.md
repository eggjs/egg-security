
2.2.2 / 2018-04-12
==================

**fixes**
  * [[`dbc9a44`](http://github.com/eggjs/egg-security/commit/dbc9a445816d69ec59320b8f655d6e965a16edfb)] - fix: format illegal url (#36) (Yiyu He <<dead_horse@qq.com>>)

**others**
  * [[`9676127`](http://github.com/eggjs/egg-security/commit/96761278b0f167c315af9d00842456aaa3a420fc)] - docs: update warning infomation for ignoreJSON (#35) (Haoliang Gao <<sakura9515@gmail.com>>)

2.2.1 / 2018-03-28
==================

**others**
  * [[`e6e5e65`](http://github.com/eggjs/egg-security/commit/e6e5e65034d314646bd5cf98303cce97fece86dd)] - docs: fix SSRF link (#34) (Haoliang Gao <<sakura9515@gmail.com>>)

2.2.0 / 2018-03-27
==================

**features**
  * [[`eba4555`](http://github.com/eggjs/egg-security/commit/eba45551f6170761792389632bdaae2afcae57d0)] - feat: support safeCurl for SSRF protection (#32) (Yiyu He <<dead_horse@qq.com>>)

**fixes**
  * [[`abc33d1`](http://github.com/eggjs/egg-security/commit/abc33d176f2ca832eddd42ae5967c25e0f91c97a)] - fix: deprecate ignoreJSON (#30) (Yiyu He <<dead_horse@qq.com>>)

**others**
  * [[`4f045a0`](http://github.com/eggjs/egg-security/commit/4f045a05da0db6c03f3578ee13aff3721f3ceec2)] - deps: add missing dependencies ip (dead-horse <<dead_horse@qq.com>>)

2.1.0 / 2018-03-14
==================

**features**
  * [[`97f372c`](http://github.com/eggjs/egg-security/commit/97f372c275cb3db99d4bdd86b19583464cdce4e3)] - feat: add RefererPolicy support (#27) (Adams <<jtyjty99999@126.com>>)

**others**
  * [[`76bd83f`](http://github.com/eggjs/egg-security/commit/76bd83fbe96e7e81a3a0a61d182c5d7e480c7856)] - chore:bump to 2.0.1 (jtyjty99999 <<jtyjty99999@126.com>>),

2.0.1 / 2018-03-14
==================

  * fix: absolute path detect should ignore evil path (#28)

2.0.0 / 2017-11-10
==================

**others**
  * [[`0ec7d2f`](http://github.com/eggjs/egg-security/commit/0ec7d2f5af03c31623b9286125d74652ba596b8b)] - refactor: use async function and support egg@2 (#25) (Yiyu He <<dead_horse@qq.com>>)

1.12.1 / 2017-08-03
==================

**others**
  * [[`870a7e2`](http://github.com/eggjs/egg-security/commit/870a7e2d26ad622a035e70565a9ca6830465326f)] - fix(csrf): ignore json request even body not exist (#23) (Yiyu He <<dead-horse@users.noreply.github.com>>)

1.12.0 / 2017-07-19
==================

  * feat: make session plugin optional (#22)

1.11.0 / 2017-06-19
==================

  * feat: add global path blocking to avoid directory traversal attack (#19)

1.10.2 / 2017-06-14
==================

  * fix: should not assert csrf when path match ignore (#20)

1.10.1 / 2017-06-04
===================

  * docs: fix License url (#18)

1.10.0 / 2017-05-09
==================

  * feat: config.security.csrf.cookieDomain can be function (#17)

1.9.0 / 2017-03-28
==================

  * feat: use egg-path-matching to support fn (#15)

1.8.0 / 2017-03-07
==================

  * feat:support muiltiple query/body key to valid csrf token (#14)

1.7.0 / 2017-03-07
==================

  * feat: add ctx.rotateCsrfToken (#13)

1.6.0 / 2017-02-20
==================

  * refactor: add csrf faq url to error msg in local env (#12)

1.5.0 / 2017-02-17
==================

  * feat: surl support protocol whitelist (#11)

1.4.0 / 2017-01-22
==================

  * refactor: rewrite csrf (#10)

1.3.0 / 2016-12-28
==================

  * feat: support hash link in shtml (#7)
  * test: fix test (#8)

1.2.1 / 2016-09-01
==================

  * fix: make sure every middleware has name (#6)

1.2.0 / 2016-08-31
==================

  * feat: disable hsts for default (#5)

1.1.0 / 2016-08-31
==================

  * refactor: remove ctoken, csrf check all post/put/.. requests (#4)

1.0.3 / 2016-08-30
==================

  * fix: lower case header will get better performance (#3)

1.0.2 / 2016-08-29
==================

  * refactor: use setRawHeader

1.0.1 / 2016-08-21
==================

  * First version

