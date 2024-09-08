module.exports = {
  webpackDevMiddlewares: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
