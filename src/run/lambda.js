/* eslint-disable global-require, import/no-unresolved, no-underscore-dangle */
const path = require('path');
const chalk = require('chalk');

module.exports = (handler, webpackConf) => {
  console.log(chalk.green('Running nova:lambda'));

  const webpack = require('webpack');
  const ServerlessOffline = require('serverless-offline/src/ServerlessOffline');

  const [serverConf] = webpackConf.filter((conf) => conf.target === 'node');

  if (!serverConf) {
    throw Error('Missing webpack configuration with target set as "node"');
  }

  const compiler = webpack({
    ...serverConf,
    output: {
      ...(serverConf.output || {}),
      libraryTarget: 'commonjs',
    },
    mode: 'development',
  });

  const outputPath = (serverConf.output && serverConf.output.path) || path.join(process.pwd(), 'dist');
  let fileName = (serverConf.output && serverConf.output.fileName) || 'server.js';
  fileName = fileName.split('.').shift();

  const handlerPath = `${path.relative(process.cwd(), outputPath)}/${fileName}`;

  let isWatching = false;
  const serverless = {
    version: '1.48.1',
    service: {
      service: 'hypernova-lambda',
      provider: {
        runtime: 'nodejs8.10',
      },
      functions: {
        batch: {
          handler: `${handlerPath}.${handler}`,
          events: [
            {
              http: {
                path: 'batch',
                method: 'POST',
              },
            },
          ],
        },
      },
    },
    cli: {
      log: (...args) => console.log(chalk.yellow(...args)),
    },
    config: {
      servicePath: process.cwd(),
    },
  };

  serverless.service.getFunction = (key) => {
    const fun = serverless.service.functions[key];

    if (!fun) {
      return null;
    }
    return {
      ...fun,
      name: key,
    };
  };

  compiler.watch({}, (error) => {
    if (error) {
      throw error;
    }

    if (isWatching) {
      console.log(chalk.yellow('Lambda code compiled.'));
      return Promise.resolve();
    }

    const slsOffline = new ServerlessOffline(serverless, { stage: 'ara', region: 'local' });

    isWatching = true;

    return Promise.resolve(slsOffline._buildServer())
      .then((server) => server.start());
  });

  return compiler;
};
