// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function (grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // all of our configuration will go here
        watch: {
            coffee_compiler: {
                files: ['./public/frontend/src/coffee/**/*.coffee', './public/admin/src/coffee/**/*.coffee'],
                tasks: ['coffee']
            },
            concat: {
                files: ['./public/frontend/src/js/**/*.js', './public/admin/src/js/**/*.js'],
                tasks: ['concat']
            },
            minify_js: {
                files: ['./public/frontend/src/js/**/*.js', './public/admin/src/js/**/*.js'],
                tasks: ['uglify']
            },
            minify_css: {
                files: ['./public/frontend/src/css/**/*.css', './public/admin/src/css/**/*.css'],
                tasks: ['cssmin']
            },
            minify_html: {
                files: ['./public/frontend/src/views/**/*.html', './public/admin/src/views/**/*.html'],
                tasks: ['htmlmin']
            }
        },
        coffee: {
            build: {
                files: [{
                    expand: true,
                    cwd: "./public/frontend/src/coffee",
                    src: ["**/*.coffee"],
                    dest: "./public/frontend/src/js",
                    ext: ".js"
                },
                    {
                        expand: true,
                        cwd: "./public/admin/src/coffee",
                        src: ["**/*.coffee"],
                        dest: "./public/admin/src/js",
                        ext: ".js"
                    }]
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            build: {
                files: {
                    './public/frontend/dist/js/main.min.js': ['./public/frontend/src/js/main.js'],
                    './public/admin/dist/js/main.min.js': ['./public/admin/src/js/main.js']
                }
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: './public/frontend/src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: './public/frontend/dist/css',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: './public/admin/src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: './public/admin/dist/css',
                    ext: '.min.css'
                }]
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            target: {
                files: [{
                    src: ['./public/frontend/src/js/**/*.js', '!./public/frontend/src/js/main.js'],
                    dest: './public/frontend/src/js/main.js'
                }, {
                    src: ['./public/admin/src/js/**/*.js', '!./public/admin/src/js/main.js'],
                    dest: './public/admin/src/js/main.js'
                }]
            }
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true
                },
                files: [{
                    expand: true,
                    cwd: './public/frontend/src/views',
                    src: '**/*.html',
                    dest: './public/frontend/dist/views'
                }, {
                    expand: true,
                    cwd: './public/admin/src/views',
                    src: '**/*.html',
                    dest: './public/admin/dist/views'
                }]
            }
        }
    });


    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
};
