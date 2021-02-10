# Atom Space Vue Preset

`@atomspace/vue` is a [Neutrino](https://neutrino.js.org) preset for Vue applications development.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Build Status][build-status]][travis-url]

## What is Neutrino?

[Neutrino](https://neutrino.js.org) is a configuration engine that allows to bundle Webpack configurations or their parts as modules and publish them to NPM. Such modules usually are called presets or middlewares. They are designed to work in conjunction with Neutrino core in your project. You can compose compilation, linting, testing and other configurations, and share them to developers.

## What features does this preset provide?

This preset does all dirty job for setting up Webpack for you. It implements a setup of projects based on [Vue](https://vuejs.org/) in a browser.

### Features

- Zero upfront configuration necessary to start developing and building a Vue web app
- Modern Babel compilation supporting ES modules, last several major browser versions, async functions, dynamic imports, ES class properties, rest spread operators, decorators and automatic polyfills bound to platforms
- Production-optimized bundles with minification and source maps
- Consider external dependencies sourcemaps for better debugging during development
- Chunking of external dependencies apart from application code. Share common dependencies between dynamic imports.
- Webpack loaders for importing Vue components, TypeScript, CSS, LESS, SASS, images, icons, fonts and SVGs
- CSS modules for `*.module.css` files and `<style module>` with support of preprocessors
- Webpack Dev Server during development on "localhost" and local network IP for external devices access
- Automatic creation of HTML pages, no templating of "index.html" necessary
- Hot Module Replacement enabled
- Disabled redundant `[HMR]` console messages
- Favicon injection
- Developer-friendly building progress bar
- Detect and warn about circular and duplicated dependencies during the build time
- Git revision information through environment variables (VERSION, COMMITHASH, BRANCH)
- Environment variables are automatically exposed if used
- Bundle Analyzer for production and development builds
- Auto-open the application in the development mode
<!-- - Automatically discovers free HTTP port to run a server locally -->

## Requirements

- Node.js v10+
- Neutrino v9
- Webpack v4
- Webpack Dev Server v3
- Vue v2

## Installation

If you have an absolutely empty project you need to initialize it first. **You can skip this step if you already have `package.json` file**

```bash
npm init -y
```

`@atomspace/vue` can be installed with NPM. Inside your project, make sure `neutrino`, `webpack` and `@atomspace/vue` are development dependencies. Also you should install `vue`

```bash
npm install --save vue
npm install --save-dev neutrino "@atomspace/vue" webpack@^4.43.0 webpack-cli@^3.3.12 webpack-dev-server
```

Now edit your project's `package.json` to add commands for starting and building the application:

**package.json**

```json
{
   "scripts": {
      "start": "webpack-dev-server",
      "build": "webpack"
   }
}
```

Then add the new file `.neutrinorc.js` in the root of the project:

**.neutrinorc.js**

```js
let vue = require('@atomspace/vue');

module.exports = {
   use: [
      vue()
   ]
};
```

And create a `webpack.config.js` file in the root of the project, that uses the Neutrino API to access the generated webpack config:

**webpack.config.js**

```js
let neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

## Project Layout

`@atomspace/vue` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the project. This includes JavaScript files, stylesheets, images, and any other assets that would be available to your compiled project. Only files explicitly imported or lazy loaded to your project will be bundled. You may use JavaScript or TypeScript for development. The entry file may be any of both: `src/index.vue` or `src/index.js`

## Quickstart

After installing Neutrino and this preset, add a new directory named `src` in the root of the project, with a single VUE file named `index.vue` in it. The preset cares about mounting to the `<div id="root"></div>` element and hot reload configuration. You only have to export your main component that refers to your application. Edit `src/index.vue` file with the following:

**src/index.vue**

```vue
<template>
   <h1>Hello</h1>
</template>
```

You can change this code base to better match your needs. Import other parts of your application and render them inside.

Start the app in a development mode:

```bash
npm start
```

The console shows that application compilation is finished and started at "localhost:8080".

## Building

The project builds static assets to the `build` directory by default when running `npm run build`:

```bash
❯ webpack

√ Vue-app 1.0.0
  Compiled successfully in 15.77s

Version: webpack 4.41.5
Time: 15700ms
Built at: 2020-01-29 23:46:56
                                             Asset      Size  Chunks             Chunk Names
       images/1d535df5e2e3bb126160e27b9235024f.jpg  58.1 KiB          [emitted]
                                 compiled/index.js   365 KiB       0  [emitted]  index
```

You can either serve or deploy the contents of this build directory as a static site.

## Hot Module Replacement

As `@atomspace/vue` completely controls the launching of your application instance. It automatically enables Hot Module Replacement for all files during development. No extra configuration or changes in your source code are necessary. You don't need to restart the application every time files are changed.

Using dynamic imports with `import()` will automatically create split points and hot replace those modules upon modification during development.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place them in a directory within `src` called `static`. All files in this directory will be copied from `src/static` to `build/static`.

### Favicon

There is a special case for a favicon. You have to put a `favicon.ico` file in the source code folder. By default it is `src/favicon.ico`. The file name is conventional and can't be changed.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this preset works. You can modify the preset settings from `.neutrinorc.js` by an options object.

The following shows how you can pass an options object to the preset and override its options, showing the defaults:

#### .neutrinorc.js

```js
let vue = require('@atomspace/vue');

module.exports = {
   use: [
      vue({
         // Inject an application startup launcher. When `false` you need to setup DOM mounting and HMR in your sorce code
         launcher: true,

         // Clear console on every build
         clean: true,

         // Include template runtime compiler. Increases the bundle ~10KB
         compiler: false,

         // Document title and the name of the terminal progress bar
         title: `${packageJson.name} ${packageJson.version}`,

         // Options related to a development server
         server: {
            https: false,
            public: true, // use local network IP address for hosting during development
            port: 8080,
            proxy: {} // e.g. { '/api': 'http://localhost:8080' }
         },

         // Automatically open a default browser on `npm start`
         open: false,

         // Add polyfills necessary for required browsers in `browsers` option depending on the usage in the code
         polyfills: false,

         // Supported browsers in a Browserlist format. The code will be transpiled to support them
         browsers: [
            'last 2 Chrome major versions',
            'last 2 Firefox major versions',
            'last 2 Edge major versions',
            'last 2 Opera major versions',
            'last 2 Safari major versions',
            'last 2 iOS major versions',
            'IE 11'
         ],

         // Enable source maps in the production build. Development sourcemaps are not affected and always turned on
         sourcemaps: true
      })
   ]
};
```

*Example: Enable HTTPS, enable auto-opening of a browser, change the page title, define supported browsers:*

#### .neutrinorc.js

```js
let vue = require('@atomspace/vue');

module.exports = {
   use: [
      vue({
         server: {
            https: true
         },
         open: true,
         title: 'Vue App',
         browsers: [
            'last 3 versions'
         ]
      })
   ]
};
```

## Customizing

Consumers may provide their custom Webpack configurations for different parts of the current preset that will override its defaults. Also if you want to construct your own preset based on `@atomspace/vue` you can use information below.

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization). `@atomspace/vue` creates some conventions to make overriding the configuration easier once you are ready to make changes. Following the customization guide and knowing the rule, loader, and plugin IDs, you can override and augment the build by providing a function to your `.neutrinorc.js` use array. You can also make these changes from the Neutrino API in a custom middleware.

By default Neutrino, and therefore this preset, creates a single **main** `index` entry point to your application, and this maps to the `index.*` file in the `src` directory.

> **Important! This preset has a limitation – it supports only a single entry point when the launcher option is enabled. Defining 2 or more may cause it to work not properly.**

You can customize a single entry point in your `.neutrinorc.js` and override a default one

```js
let vue = require('@atomspace/vue');

module.exports = {
   options: {
      mains: {
         index: './main.vue'
      }
   },
   use: [
      vue()
   ]
};
```

### Launcher

This preset wraps your application with a Vue instance. It can be configured using `launcher` property in the [preset options](#preset-options). So you don't need to think about how to mount and render your application. This is completely managed by `@atomspace/vue` preset.

If you want to **disable** the launcher you need to explicitly set the option to `false`

```js
vue({
   launcher: false
});
```

This turns your application into a regular Web application. You will have to manage the starting by yourself as it is described in [Vue documentation](https://vuejs.org/v2/guide/index.html).

## Webpack config

Sometime you want to extend Webpack configuration with custom loaders or plugins. This can be done in `.neutrinorc.js` file using [Neutrino API](https://neutrinojs.org/webpack-chain/) also known as [`webpack-chain`](https://www.npmjs.com/package/webpack-chain).

### Plugins

For example, you can add [TypeScript checking](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)

```js
let vue = require('@atomspace/vue');
let TsChecker = require('fork-ts-checker-webpack-plugin');

module.exports = {
   use: [
      vue(),
      function tsCheckMiddleware (neutrino) {
         let prodMode = process.env.NODE_ENV === 'production';

         if (prodMode) return;

         neutrino.config
            .plugin('ts-checker')
               .use(TsChecker, [{
                  // options
               }])
               .end();
      }
   ]
};
```

Specifically for this plugin you also need to create `tsconfig.json` file

```json
{
   "compilerOptions": {
      "target": "es2016",
      "module": "commonjs",
      "jsx": false,
      "strict": true,
      "alwaysStrict": true,
      "moduleResolution": "node",
      "esModuleInterop": true
   },
   "include": ["src/**/*"],
   "exclude": ["node_modules", "build/**/*"]
}
```

It will enable highlighting in your code editor too.

## Troubleshooting

### Memory limit

Quite often during the production build of large projects there is not enough memory for the NodeJS process.

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

To resolve this you should increase the limit using CLI flags

```json
{
   "scripts": {
      "build": "node --max-old-space-size=8192 node_modules/webpack/bin/webpack"
   }
}
```

### Local builds

By default the project is built with settings optimized for Browser History API. It can't properly run in the File System using `file://` protocol. To make it run locally with double click on `index.html` you can add custom middleware to **.neutrinorc.js** file that overrides some settings

```js
let vue = require('@atomspace/vue');

module.exports = {
   use: [
      vue(),
      function ({ config }) {
         // necessary for correct work on local File System
         config.output.publicPath('./');
      }
   ]
};
```

## VSCode tips

### Project settings

These are suggested workspace settings for VSCode editor:

#### .vscode/settings.json

```json
{
   "files.autoSave": "onFocusChange"
}
```

This should prevent constant building as you type code.

### Modules resolving

VSCode may not recognize modules paths started from `@`

```js
import module from '@/modules/module';
```

To be able to use the editor's autocompletion and autosuggestions in such paths add the next file into the project root folder and restart the editor

#### jsconfig.json

```json
{
   "allowJs": true,
   "compilerOptions": {
      "baseUrl": ".",
      "paths": {
         "@/*": ["./src/*"]
      }
   },
   "include": ["src/**/*", "test/**/*"],
   "exclude": ["node_modules", "build"]
}
 ```

[npm-image]: https://img.shields.io/npm/v/@atomspace/vue.svg
[npm-downloads]: https://img.shields.io/npm/dt/@atomspace/vue.svg
[npm-url]: https://npmjs.org/package/@atomspace/vue
[build-status]: https://travis-ci.org/atomspace/atomspace-vue.svg?branch=master
[travis-url]: https://travis-ci.org/atomspace/atomspace-vue
