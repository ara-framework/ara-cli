const os = require('os');
const download = require('download');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const execa = require('execa');

module.exports = async (config, dest) => {
  let url;
  let fileName = 'nova-proxy';
  const platform = os.platform();
  if (platform === 'darwin') {
    url = 'https://github.com/ara-framework/nova-proxy/releases/download/1.0.5/nova-proxy-darwin-amd64';
  } else if (platform === 'win32') {
    url = 'https://github.com/ara-framework/nova-proxy/releases/download/1.0.5/nova-proxy-windows-amd64.exe';
    fileName = `${fileName}.exe`;
  }

  const executable = path.join(dest, fileName);

  if (!fs.existsSync(executable)) {
    if (url) {
      const spinner = ora('Downloading nova-proxy').start();
      try {
        await download(url, dest, { filename: fileName });
        fs.chmodSync(executable, 755);
        spinner.succeed('Downloaded nova-proxy');
      } catch (error) {
        console.error(error);
        spinner.fail('Downloading nova-proxy failed');
        return null;
      }
    } else {
      return console.error(chalk.red(`run:proxy command is not supported in "${platform}"`));
    }
  }

  try {
    process.env.CONFIG_FILE = process.env.CONFIG_FILE || config;

    if (!process.env.HYPERNOVA_BATCH) {
      return console.error(chalk.red('HYPERNOVA_BATCH environment variable is required'));
    }
    console.log(chalk.green('Nova proxy running!!'));
    const child = execa(executable);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } catch (error) {
    console.error(error);
    console.error(chalk.red('Nova proxy failed when running'));
  }

  return null;
};
