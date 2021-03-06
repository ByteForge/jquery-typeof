"use strict";
module.exports = function(grunt) {
    var src = "jquery.typeof";

    var licenseMainLine
            = src + " <%= pkg.version %> Copyright (c) 2014 \"Richard KnG\" Richárd Szakács",
        licenseItselfLine
            = "Licensed under the MIT license.",
        licenseForDetailsLine
            = "see: <%= pkg.homepage %> for details";

    var bannerProductionNormal = "/*" + "\n"
        + " " +  licenseMainLine + "\n"
        + " " +  licenseItselfLine + "\n"
        + " " +  licenseForDetailsLine + "\n"
        + "*/",

        bannerProductionMinimized = "/* "
            + licenseMainLine + " | "
            + licenseItselfLine + " | "
            + licenseForDetailsLine
            + " */";

    var uglifyjs_src = {};
    uglifyjs_src["lib/" + src + ".min.js"] = ["src/" + src + ".js"];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            src: ["src/" + src + ".js"]
        },
        clean: [
            "lib/" + src + ".js",
            "lib/" + src + ".min.js"
        ],
        uglify: {
            dist: {
                files: uglifyjs_src
            }
        },
        copy: {
            main: {
                src: "src/" + src + ".js",
                dest: "lib/" + src + ".js"
            },
            sub: {
                src: "src/" + src + ".js",
                dest: "./" + src + ".js"
            }
        },
        usebanner: {
            normal: {
              options: {
                position: 'top',
                banner: bannerProductionNormal,
                linebreak: true
              },
              files: {
                src: [ "lib/" + src + ".js", "./" + src + ".js" ]
              }
            },
            minimized: {
              options: {
                position: 'top',
                banner: bannerProductionMinimized,
                linebreak: true
              },
              files: {
                src: "lib/" + src + ".min.js"
              }
            }
        },

        // Tests
        jasmine_node: {
            specNameMatcher: 'spec',
            projectRoot: 'test/spec/'
        },
        jasmine: {
            browserGlobal: {
                src: ["src/" + src + ".js"],
                options: {
                    specs: "test/spec/**/*.spec.js",
                    vendor: [
                        "node_modules/jquery/dist/jquery.js",
                        "node_modules/qulog/qulog.js"
                    ]
                }
            },
            browserAMD: {
                src: ["src/" + src + ".js"],
                options: {
                    specs: 'test/spec/**/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            //baseUrl: "./",
                            paths: {
                                jquery: "node_modules/jquery/dist/jquery"
                            },
                            map: {
                                '*': {
                                    qulog: "node_modules/qulog/qulog",
                                    "jquery-exists": "src/jquery.hasparent"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');

    // For tests
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask("build", ["jshint", "clean", "uglify", "copy", "usebanner"]);
    grunt.registerTask("default", ["jshint", "jasmine_node", "jasmine"]);
};