/* jslint node: true */
"use strict";

/*
 * grunt-userev
 * https://github.com/k3karthic/grunt-userev
 *
 * Copyright (c) 2013 Salsita Software
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Read package info.
        pkg: grunt.file.readJSON('package.json'),

        // Lint sources.
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        // Watch sources and run tests.
        delta: {
            js: {
                files: ['test/**', 'tasks/*.js', 'Gruntfile.js'],
                tasks: ['jshint', 'test'],
            },

            jshintrc: {
                files: ['.jshintrc'],
                tasks: ['jshint'],
            },
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    // On watch, run both default and delta (original watch).
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['default', 'delta']);

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'nodeunit']);
};
