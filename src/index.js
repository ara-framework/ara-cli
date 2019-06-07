#!/usr/bin/env node
const cli = require('cac')();

const path = require('path');
const sao = require('sao');

const generateProject = require('./generators/project');

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

cli.parse();
