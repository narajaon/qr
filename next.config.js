const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const webpack = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...defaultConfig,
      future: {
        webpack5: true,
      },
    };
  }
  return defaultConfig;
};

module.exports = webpack;
