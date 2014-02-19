"use strict";

var grunt = require('grunt');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
  test.expect(numAssertions)
  test.done()
  Test assertions:
  test.ok(value, [message])
  test.equal(actual, expected, [message])
  test.notEqual(actual, expected, [message])
  test.deepEqual(actual, expected, [message])
  test.notDeepEqual(actual, expected, [message])
  test.strictEqual(actual, expected, [message])
  test.notStrictEqual(actual, expected, [message])
  test.throws(block, [error], [message])
  test.doesNotThrow(block, [error], [message])
  test.ifError(value)
*/

exports.runtaskTest = {
    setUp: function (done) {
        grunt.file.mkdir('build');
        grunt.file.mkdir('build/css');
        grunt.file.write('build/css/jquery.css', '');
        grunt.file.write('build/css/bootstrap/test.css', '');
        grunt.file.copy(
            path.join(
                __dirname,
                'fixtures/index.html'
            ),
            'build/index.html'
        );

        done();
    },

    someTest: function (test) {
        grunt.util.spawn({
            grunt: true,
            args: ['userevTest']
        }, function(err, result) {
            if (err) {
                grunt.log.writeln(err);
            } else {
                var changed = grunt.file.read('build/index.html');

                test.ok(changed.match(/<link src="\/css\/jquery\.d41d8cd9\.css">/));
                test.ok(changed.match(/<link src="\/css\/bootstrap\/test\.d41d8cd9\.css">/));

                test.done();
            }
        });
    },
};
