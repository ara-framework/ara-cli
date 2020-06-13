const os = require('os');
const download = require('download');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const execa = require('execa');

const VERSION = '1.1.0';

module.exports = async ({ config, port }, dest) => {
  let url;
  let fileName = `nova-proxy_${VERSION}`;
  const platform = os.platform();
  if (platform === 'darwin') {
    url = `https://github.com/ara-framework/nova-proxy/releases/download/${VERSION}/nova-proxy-darwin-amd64`;
  } else if (platform === 'linux') {
    url = `https://github.com/ara-framework/nova-proxy/releases/download/${VERSION}/nova-proxy-linux-amd64`;
  } else if (platform === 'win32') {
    url = `https://github.com/ara-framework/nova-proxy/releases/download/${VERSION}/nova-proxy-windows-amd64.exe`;
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
    process.env.PORT = process.env.PORT || port;

    if (!process.env.HYPERNOVA_BATCH) {
      return console.error(chalk.red('HYPERNOVA_BATCH environment variable is required'));
    }

    const child = execa(executable);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } catch (error) {
    console.error(error);
    console.error(chalk.red('Nova proxy failed when running'));
  }

  return null;
};
