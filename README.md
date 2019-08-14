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
