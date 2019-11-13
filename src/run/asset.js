/* eslint-disable global-require, import/no-unresolved */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const corsConfig = require.resolve('s3rver/example/cors.xml');
const defaultBucket = 'assets';

module.exports = (webpackConf) => {
  const [clientConf] = webpackConf.filter((conf) => conf.target === 'web');

  if (!clientConf) {
    throw Error('Missing webpack configuration with target set as "web"');
  }

  const webpack = require('webpack');
  const S3rver = require('s3rver');
  const AWS = require('aws-sdk');

  const compiler = webpack({
    ...clientConf,
    mode: 'development',
    stats: 'verbose',
  });

  const s3rver = new S3rver({
    directory: path.join(process.cwd(), '.ara/s3'),
    configureBuckets: [
      {
        name: defaultBucket,
        configs: [fs.readFileSync(corsConfig)],
      },
    ],
  });

  s3rver.run((err, { address, port } = {}) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.green(`S3 server listening on http://${address}:${port}`));

      const outputPath = (clientConf.output && clientConf.output.path) || path.join(process.pwd(), 'dist');
      const fileName = (clientConf.output && clientConf.output.fileName) || 'client.js';

      const s3 = new AWS.S3({
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        region: 'local',
        s3ForcePathStyle: true,
        endpoint: new AWS.Endpoint(`http://${address}:${port}`),
      });

      compiler.watch({}, (error) => {
        if (error) {
          throw error;
        }

        return s3.putObject({
          Key: fileName,
          Bucket: defaultBucket,
          ACL: 'public-read',
          ContentType: 'text/javascript',
          Body: fs.readFileSync(path.join(outputPath, fileName)),
        }).promise()
          .catch((e) => console.error(e))
          .then(() => console.log(chalk.green(`Client script in "${defaultBucket}" bucket`)));
      });
    }
  });
};
