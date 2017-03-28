'use strict';

module.exports = {
  write: true,
  prefix: '^',
  test: [
    'test',
    'benchmark',
  ],
  devdep: [
    'autod',
    'beautify-benchmark',
    'benchmark',
    'egg',
    'egg-bin',
    'egg-ci',
    'egg-mock',
    'egg-view-nunjucks',
    'eslint',
    'eslint-config-egg',
    'pedding',
    'rimraf',
    'should',
    'should-http',
    'spy',
    'supertest'
  ],
  exclude: [
    './test/fixtures',
  ],
  semver: [
    'koa-compose@2',
  ],
}
