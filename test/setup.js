'use strict';

const mm = require('egg-mock');

const app = mm.app;
const cluster = mm.cluster;

function disableWatcher(options) {
  options = options || {};
  return {
    ...options,
    plugins: {
      ...options.plugins,
      watcher: {
        ...options.plugins?.watcher,
        enable: false,
      },
    },
  };
}

mm.app = options => app(disableWatcher(options));
mm.cluster = options => cluster(disableWatcher(options));
