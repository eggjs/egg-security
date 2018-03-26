'use strict';

const utils = require('./lib/utils');

module.exports = agent => {
  utils.processSSRFConfig(agent.config.security.ssrf);
};
