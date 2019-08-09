
1.14.0 / 2019-08-09
==================

**others**
  * [[`244b176`](http://github.com/eggjs/egg-security/commit/244b17681e9e7109868007f42481dec827bc988d)] - backport: csrf support referer (#57) (吖猩 <<whxaxes@gmail.com>>)

1.13.2 / 2018-07-11
==================

**fixes**
  * [[`3800dd8`](http://github.com/eggjs/egg-security/commit/3800dd8dbd6a7767f1f91b3ae5488983f4341893)] - fix: disable nosniff on redirect status (#39) (fengmk2 <<fengmk2@gmail.com>>)

1.13.1 / 2018-04-12
==================

**fixes**
  * [[`fbc552d`](http://github.com/eggjs/egg-security/commit/fbc552dbd3cdb67e7eb830417cf266b90fd07807)] - fix: format illegal url (#36) (Yiyu He <<dead_horse@qq.com>>)

**others**
  * [[`cf36048`](http://github.com/eggjs/egg-security/commit/cf3604823bb2e2cb72c9f90e393cac82dcfa9c4d)] - docs: update warning infomation for ignoreJSON (#35) (Haoliang Gao <<sakura9515@gmail.com>>)

1.13.0 / 2018-03-27
==================

**features**
  * [[`21abb13`](http://github.com/eggjs/egg-security/commit/21abb13c166bde7d9fbae9a29d9b1057d9ca1fa6)] - feat: support safeCurl for SSRF protection  (#33) (Yiyu He <<dead_horse@qq.com>>)

**fixes**
  * [[`e573b61`](http://github.com/eggjs/egg-security/commit/e573b61e53e315cc969a805c2655bf011e2d59b1)] - fix: deprecate ignoreJSON (#31) (Yiyu He <<dead_horse@qq.com>>)

**others**
  * [[`48eadd4`](http://github.com/eggjs/egg-security/commit/48eadd47447e41d25e3d8e12614fa273bda5b8ad)] - deps: add missing dependencies ip (dead-horse <<dead_horse@qq.com>>)

1.12.2 / 2018-03-14
==================

**fixes**
  * [[`c89e291`](http://github.com/eggjs/egg-security/commit/c89e291985af6cd10496699309aa4c0565178a08)] - fix: absolute path detect should ignore evil path (#29) (fengmk2 <<fengmk2@gmail.com>>)

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

