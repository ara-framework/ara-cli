const os = require('os');
const download = require('download');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const execa = require('execa');

module.exports = async (config, dest) => {
  let url;
  let fileName = 'nova-cluster';
  const platform = os.platform();
  if (platform === 'darwin') {
    url = 'https://github.com/ara-framework/nova-cluster/releases/download/1.2.0/nova-cluster-darwin-amd64';
  } else if (platform === 'win32') {
    url = 'https://github.com/ara-framework/nova-cluster/releases/download/1.2.0/nova-cluster-windows-amd64.exe';
    fileName = `${fileName}.exe`;
  }

  const executable = path.join(dest, fileName);

  if (!fs.existsSync(executable)) {
    if (url) {
      const spinner = ora('Downloading nova-cluster').start();
      try {
        await download(url, dest, { filename: fileName });
        fs.chmodSync(executable, 755);
        spinner.succeed('Downloaded nova-cluster');
      } catch (error) {
        spinner.fail('Downloadind nova-cluster failed');
        return null;
      }
    } else {
      return console.error(chalk.red(`run:cluster command is not supported in "${platform}"`));
    }
  }

  try {
    process.env.CONFIG_FILE = process.env.CONFIG_FILE || config;

    execa(executable).stdout.pipe(process.stdout);
  } catch (error) {
    console.error(chalk.red(error.stderr || 'Nova cluster failed when running'));
  }

  return null;
};
