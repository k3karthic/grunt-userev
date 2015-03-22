"use strict";

/*
 * grunt-userev
 * https://github.com/k3karthic/grunt-userev
 *
 * Copyright (c) 2013 Salsita Software
 * Licensed under the MIT license.
 */

// http://stackoverflow.com/a/18620139/899047
var reEscape = function(s) {
    return s.replace(/[$-\/?[-^{|}]/g, '\\$&');
};

// http://stackoverflow.com/a/2548133/899047
var endsWith = function(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
};

module.exports = function (grunt) {
    var versioned;
    var options;

    var checkFile = function(filepath) {
        if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
        } else {
            return true;
        }
    };

    var processFile = function(filepath) {
        var content = grunt.file.read(filepath);
        var updated = false;

        grunt.log.writeln('Updating: ' + filepath.cyan);

        for (var label in options.patterns) {
            if (options.patterns.hasOwnProperty(label)) {
                var pattern = options.patterns[label];
                var matches = content.match(pattern);

                if (matches === null) {
                    continue;
                }

                var index,tot;
                for (index=0, tot=matches.length; index < tot; index=index+1) {
                    var match = matches[index];

                    grunt.log.debug(
                        'Matching ' +
                            [filepath, pattern, JSON.stringify(match)].join(': ')
                    );

                    for (var assetpath in versioned) {
                        if (versioned.hasOwnProperty(assetpath) &&
                            endsWith(assetpath, match)) {
                            var hashLink = versioned[assetpath].slice(assetpath.length - match.length);

                            grunt.log.writeln(label + ': ' + match + ' -> ' + hashLink);
                            content = content.replace(match, hashLink);
                            updated = true;
                        }
                    }
                }
            }
        }

        if (updated) {
            grunt.file.write(filepath, content);
        }
    };

    grunt.task.registerMultiTask('userev', 'Update versioned assets references.', function() {
        var path = require('path');
        var sep = '/';

        versioned = grunt.filerev && grunt.filerev.summary;
        options = this.options();

        if (versioned === undefined) {
            grunt.log.debug('Filerev summary not found or empty');

            return;
        }

        if (path.sep !== sep) {
            var re = new RegExp(reEscape(path.sep), 'g');

            for (var assetpath in versioned) {
                if (versioned.hasOwnProperty(assetpath)) {
					// Fix by https://github.com/upta
					//   Don't nuke grunt.filerev.summary if userev is invoked multiple times
					if ( assetpath !== assetpath.replace( re, sep ) ) {
						versioned[assetpath.replace(re, sep)] = versioned[assetpath].replace(re, sep);
						delete versioned[assetpath];
					}
                }
            }
        }

        grunt.log.debug(
            this.nameArgs +
            ': ' +
            JSON.stringify(this.files, null, 4) +
            JSON.stringify(options, null, 4)
        );
        grunt.log.debug('filerev.summary: ' + JSON.stringify(versioned, null, 4));

        this.files.forEach(function(file) {
            file.src
                .filter(checkFile)
                .forEach(processFile);
        });
    });
};
