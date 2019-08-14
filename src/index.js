#!/usr/bin/env node
const cli = require('cac')();

const path = require('path');
const sao = require('sao');

const generateProject = require('./generators/project');
const runLambda = require('./run/lambda');
const serveAsset = require('./run/asset');

cli.command('new:project <outDir>', 'New Project')
  .action(outDir => generateProject(outDir));

cli.command('new:nova <outDir>', 'New Micro-Frontend')
  .option('-t, --template <template>', 'Template Type')
  .action((outDir, { template = 'vue' }) => {
    const appPath = path.join(process.cwd(), outDir);
    const options = {
      outDir: appPath,
      generator: `ara-framework/create-hypernova-${template}`,
    };

    return sao(options)
      .run();
  });

cli.command('run:lambda', 'Run Hypernova lambda function')
  .option('-h, --handler <handler>', 'Template Type.')
  .option('--asset', 'Serves client-side entry point.')
  .action(({ handler = 'handler', asset }) => {
    const webpackfile = path.join(process.cwd(), 'webpack.config.js');
    let webpackConf = require(webpackfile);// eslint-disable-line

    webpackConf = Array.isArray(webpackConf) ? webpackConf : [webpackConf];

    runLambda(handler, webpackConf);

    if (asset) {
      serveAsset(webpackConf);
    }
  });

cli.parse();
