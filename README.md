# Ara Framework CLI

> Scaffolding tool for Ara Framework

## Installation

You can install the package from npm.

```bash
npm i -g ara-cli
```

## Usage

### Create Ara Project

```bash
ara new:project ara-demo
```

### Create Nova Microfrontend

```bash
ara new:nova <project-folder>
```

By default the scaffolding for nova uses a Vue.js template but you can use more passing the flag `-t, --template`

Supported templates:
- vue
- angular
- svelte
- preact
- hyperapp

```bash
ara new:nova -t angular <nova-folder>
```

### Run Hypernova (Nova) Lambda locally

Run command:

```shell
ara run:lambda
```

Serve the client script locally using an S3 local server:

```shell
ara run:lambda --asset
```

### Run Nova Proxy

Nova Proxy needs a configuration file:

```json
{
  "locations": [
    {
      "path": "/",
      "host": "http://localhost:8000",
      "modifyResponse": true
    }
  ]
}
```

Before to run the command we need to set the `HYPERNOVA_BATCH` variable using the Nova service endpoint.

```shell
export HYPERNOVA_BATCH=http://localhost:3000/batch
```

The command uses a configuration file named `nova-proxy.json` in the folder where the command is running, otherwise you need to pass the `--config` parameter with a different path.
```
ara run:proxy --config ./nova-proxy.json
```

### Run Nova Cluster

Nova Cluster needs a configuration file in order to map the views with their nova servers.

```json
{
  "Navbar": {
    "server": "http://localhost:3031/batch"
  },
  "Home": {
    "server": "http://localhost:3030/batch"
  }
}
```

The command uses a configuration file named `views.json` in the folder where the command is running, otherwise you need to pass the `--config` parameter with a different path.
```
ara run:cluster --config ./views.json
```