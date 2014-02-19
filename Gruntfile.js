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

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: 'build/css/**/*.css'
            }
        },

        userev: {
            options: {
                hash: /(\.[a-f0-9]{8})\.[a-z]+$/,
            },
            html: {
                src: 'build/index.html',
                options: {
                    patterns: {
                        'versioned css': new RegExp('css/[a-z0-9./]*css','g')
                    }
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        // Watch sources and run tests.
        watch: {
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

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'nodeunit']);

    grunt.registerTask('userevTest', ['filerev','userev']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test', 'watch']);
};
