# grunt-userev2 <a href='https://github.com/salsita'><img align='right' title='Salsita' src='https://www.google.com/a/cpanel/salsitasoft.com/images/logo.gif?alpha=1' _src='https://1.gravatar.com/avatar/d413290a5fe1385efcf5a344d4a0b588?s=50' /></a>

> Update references to assets versioned with [grunt-filerev](https://github.com/yeoman/grunt-filerev).

<a href='https://npmjs.org/package/grunt-userev2'><img align='right' alt='npm' title='npm info' src='https://nodei.co/npm/grunt-userev2.png?compact=true' /></a>&nbsp;
[![Build Status](https://travis-ci.org/k3karthic/grunt-userev.png?branch=master)](https://travis-ci.org/k3karthic/grunt-userev) 
[![dependencies](https://david-dm.org/k3karthic/grunt-userev.png)](https://david-dm.org/k3karthic/grunt-userev) 
[![dev-dependencies](https://david-dm.org/k3karthic/grunt-userev/dev-status.png)](https://david-dm.org/k3karthic/grunt-userev#info=devDependencies)



## Getting Started

This plugin requires [Grunt](http://gruntjs.com).

If you haven't used Grunt before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-userev2 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-userev2');
```


## The "userev" task

### Overview

In your project's Gruntfile, configure `userev` to update references to assets versioned by [grunt-filerev](https://github.com/yeoman/grunt-filerev). It will automatically use [`grunt.filerev.summary`](https://github.com/yeoman/grunt-filerev#summary).


```js
grunt.initConfig({
  filerev: {
    options: {
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8
    },
    sourcemaps: {        // Rename sourcemaps.
      src: ['build/css/*.map.css', 'build/js/*.map.js'],
    },
    assets: {            // Rename minified js/css.
      src: ['build/css/*.css', 'build/js/*.js', '!build/css/*.map.css', '!build/js/*.map.js'],
    },
  },

  userev: {
    options: {
      hash: /(\.[a-f0-9]{8})\.[a-z]+$/,
    },
    assets: {            // Link to sourcemaps in minified js/css.
      src: ['build/css/*.css', 'build/js/*.js', '!build/css/*.map.css', '!build/js/*.map.js'],
      options: {
        patterns: {
          'Linking versioned source maps': /sourceMappingURL=([a-z0-9.]*\.map)/,
        },
      },
    },
    index: {             // Link to minified js/css in index html.
      src: 'build/index.html',
      options: {
        patterns: {
          'Linking versioned asset': /(css\/[a-z0-9./]*\.css)/,
          'Linking versioned assets': /(css\/[a-z0-9./]*\.css)/g,
        },
      },
    },
  },
});

grunt.registerTask( 'rev', [
  'filerev:sourcemaps',  // Rename sourcemaps.
  'userev:assets',       // Link to sourcemaps in minified js/css.
  'filerev:assets',      // Rename minified js/css.
  'userev:index',        // Link to minified js/css in index html.
]);

```


### Options

#### patterns
Type: `Object {Key: RegExp}`
Default: none

Reference RegExp patterns are matched in source files. The first matched group is checked if it matches ending of any key in [`grunt.filerev.summary`](https://github.com/yeoman/grunt-filerev#summary). The key names are used to log processing of matched pattern.

To match multiple assets in a single file set the global modifier.

#### hash
Type: `RegExp`
Default: none

If specified, the RegExp pattern is matched against matched references and the first matched group (the hash in filename) is removed. This allows to update the references in source files multiple times without need to regenerate them.


## Contributing

Welcome to the project. Choose a way that suits you. You'll need a [GitHub account](https://github.com/signup/free).

### Submit a bug, or feature request

- Search [existing issues](https://github.com/k3karthic/grunt-userev/issues) to avoid duplicities.
- [Submit an issue](https://github.com/k3karthic/grunt-userev/issues/new) with label `bug`, or `enhancement`.
- For a bug, include any relevant information, e.g. task output, installed OS/Node.js/Grunt/grunt-userev versions, and steps to reproduce.

## License

Copyright 2013 [Salsita Software](http://salsitasoft.com). Licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
