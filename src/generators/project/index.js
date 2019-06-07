const fs = require('fs');
const path = require('path');
const majo = require('majo');
const chalk = require('chalk');

module.exports = (name) => {
  const appPath = path.join(process.cwd(), name);

  if (fs.existsSync(appPath)) {
    throw new Error(`Cannot override contents of [${name}]. Make sure to delete it or specify a new path`);
  }

  fs.mkdirSync(appPath);

  const stream = majo();

  const templatePath = path.join(__dirname, 'template');

  return stream.source('**', {
    baseDir: templatePath,
  })
    .dest(appPath)
    .then(() => console.log(chalk.green(`Project [${name}] Created!!`))); /* eslint-disable-line no-console */
};
