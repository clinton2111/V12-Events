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
                files: ['./frontend/src/coffee/**/*.coffee', './admin/src/coffee/**/*.coffee'],
                tasks: ['coffee']
            },
            concat: {
                files: ['./frontend/src/js/**/*.js', './admin/src/js/**/*.js'],
                tasks: ['concat']
            },
            minify_js: {
                files: ['./frontend/src/js/**/*.js', './admin/src/js/**/*.js'],
                tasks: ['uglify']
            },
            minify_css: {
                files: ['./frontend/src/css/**/*.css', './admin/src/css/**/*.css'],
                tasks: ['cssmin']
            },
            minify_html: {
                files: ['./frontend/src/views/**/*.html', './admin/src/views/**/*.html'],
                tasks: ['htmlmin']
            }
        },
        coffee: {
            build: {
                files: [{
                    expand: true,
                    cwd: "./frontend/src/coffee",
                    src: ["**/*.coffee"],
                    dest: "./frontend/src/js",
                    ext: ".js"
                },
                    {
                        expand: true,
                        cwd: "./admin/src/coffee",
                        src: ["**/*.coffee"],
                        dest: "./admin/src/js",
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
                    './frontend/dist/js/main.min.js': ['./frontend/src/js/main.js'],
                    './admin/dist/js/main.min.js': ['./admin/src/js/main.js']
                }
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: './frontend/src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: './frontend/dist/css',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: './admin/src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: './admin/dist/css',
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
                    src: ['./frontend/src/js/**/*.js', '!./frontend/src/js/main.js'],
                    dest: './frontend/src/js/main.js'
                }, {
                    src: ['./admin/src/js/**/*.js', '!./admin/src/js/main.js'],
                    dest: './admin/src/js/main.js'
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
                    cwd: './frontend/src/views',
                    src: '**/*.html',
                    dest: './frontend/dist/views'
                }, {
                    expand: true,
                    cwd: './admin/src/views',
                    src: '**/*.html',
                    dest: './admin/dist/views'
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
