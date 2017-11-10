
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

