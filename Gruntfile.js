// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function (grunt) {

    //CSS and JS dependencies for the frontend and backend
    var frontend_js_dependencies = ['bower_components/jquery/dist/jquery.min.js', 'bower_components/angular/angular.min.js', 'bower_components/angular-ui-router/release/angular-ui-router.min.js', "bower_components/Materialize/dist/js/materialize.min.js", "bower_components/angular-scroll/angular-scroll.min.js", "bower_components/underscore/underscore-min.js", "bower_components/angular-lazy-img/release/angular-lazy-img.min.js", "bower_components/lightbox2/dist/js/lightbox.min.js", "bower_components/angular-recaptcha/release/angular-recaptcha.min.js", "bower_components/angular-waypoints/dist/angular-waypoints.all.min.js"];
    var frontend_css_dependencies = ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/lightbox2/dist/css/lightbox.min.css", "bower_components/animate.css/animate.min.css"];
    var admin_js_dependencies = [];
    var admin_css_dependencies = [];

    //CoffeeScript Locations
    var frontend_coffee_src = './frontend/src/coffee';
    var admin_coffee_src = './admin/src/coffee';

    //JS Locations
    var frontend_js_src = './frontend/src/js';
    var frontend_js_dist = './frontend/dist/js';
    var admin_js_src = './admin/src/js';
    var admin_js_dist = './admin/dist/js';

    //SASS Locations
    var frontend_sass_src = './frontend/src/sass';
    var admin_sass_src = './admin/src/sass';

    //CSS Locations
    var frontend_css_src = './frontend/src/css';
    var frontend_css_dist = './frontend/dist/css';
    var admin_css_src = './admin/src/css';
    var admin_css_dist = './admin/dist/css';

    //Views Locations
    var frontend_views_src = './frontend/src/views';
    var frontend_views_dist = './frontend/dist/views';
    var admin_views_src = './admin/src/views';
    var admin_views_dist = './admin/dist/views';

    //Sass Requires
    var sass_require = ['bourbon'];

    var mozjpeg = require('imagemin-mozjpeg');


    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // all of our configuration will go here
        watch: {
            coffee_frontend: {
                files: [frontend_coffee_src + '/**/*.coffee'],
                tasks: ['coffee:frontend']
            },
            coffee_admin: {
                files: [admin_coffee_src + '/**/*.coffee'],
                tasks: ['coffee:admin']
            },
            concat: {
                files: [frontend_js_src + '/**/*.js', admin_js_src + '/**/*.js', '!' + frontend_js_src + '/main.js', '!' + admin_js_src + '/main.js'],
                tasks: ['concat:target']
            },
            compass_frontend: {
                files: [frontend_sass_src + '/**/*.scss'],
                tasks: ['compass:frontend']
            },
            compass_admin: {
                files: [admin_sass_src + '/**/*.scss'],
                tasks: ['compass:admin']
            }
        },
        coffee: {
            frontend: {
                files: [{
                    expand: true,
                    cwd: frontend_coffee_src,
                    src: ["**/*.coffee"],
                    dest: frontend_js_src,
                    ext: ".js"
                }]
            }, admin: {
                files: [
                    {
                        expand: true,
                        cwd: admin_coffee_src,
                        src: ["**/*.coffee"],
                        dest: admin_js_src,
                        ext: ".js"
                    }]
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            build: {
                files: [{
                    expand: true,
                    cwd: frontend_js_src,
                    src: ['main.js'],
                    dest: frontend_js_dist,
                    ext: '.min.js'
                }, {
                    expand: true,
                    cwd: admin_js_src,
                    src: ['main.js'],
                    dest: admin_js_dist,
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: frontend_css_src,
                    src: ['*.css', '!*.min.css'],
                    dest: frontend_css_dist,
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: admin_css_src,
                    src: ['*.css', '!*.min.css'],
                    dest: admin_css_dist,
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
                    src: [frontend_js_src + '/**/*.js', '!' + frontend_js_src + '/main.js'],
                    dest: frontend_js_src + '/main.js'
                }, {
                    src: [admin_js_src + '/**/*.js', '!' + admin_js_src + '/main.js'],
                    dest: admin_js_src + '/main.js'
                }]
            },
            vendor: {
                files: [{
                    src: frontend_js_dependencies,
                    dest: './frontend/dist/js/vendor.js'
                }, {
                    src: admin_js_dependencies,
                    dest: './admin/dist/js/vendor.js'
                }, {
                    src: frontend_css_dependencies,
                    dest: './frontend/dist/css/vendor.css'
                }, {
                    src: admin_css_dependencies,
                    dest: './admin/dist/css/vendor.css'
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
                    cwd: frontend_views_src,
                    src: '**/*.html',
                    dest: frontend_views_dist
                }, {
                    expand: true,
                    cwd: admin_views_src,
                    src: '**/*.html',
                    dest: admin_views_dist
                },
                    {
                        '_final/index.html': './index.html',
                        '_final/admin/index.html': './admin/index.html'
                    }]
            }
        },
        compass: {
            frontend: {
                options: {
                    sassDir: frontend_sass_src,
                    cssDir: frontend_css_src,
                    imagesDir: 'assets',
                    environment: 'development',
                    outputStyle: 'expanded',
                    require: sass_require
                }
            },
            admin: {
                options: {
                    sassDir: admin_sass_src,
                    cssDir: admin_css_src,
                    environment: 'development',
                    outputStyle: 'expanded',
                    require: sass_require
                }
            }
        },
        copy: {
            main: {
                files: [
                    //Copying of Index files are taken care by HTMLmin:indexes task

                    //frontend Files
                    {expand: true, src: ['./frontend/dist/**'], dest: '_final/'},

                    //admin Files
                    {expand: true, src: ['./admin/dist/**'], dest: '_final/'},

                    //assets Files
                    {expand: true, src: ['./assets/**'], dest: '_final/'},

                    //php Api Files
                    {expand: true, src: ['./api/**'], dest: '_final/'},

                    //Vendor Files
                    {expand: true, src: ['./vendor/**'], dest: '_final/'},

                    //.htaccess Files
                    {expand: true, src: ['.htaccess'], dest: '_final/'},

                    //.env
                    {expand: true, src: ['./api/.env'], dest: '_final/', filter: 'isFile'},

                ]
            }
        },
        imagemin: {
            bulid: {
                options: {
                    optimizationLevel: 4,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: ['*.{png,jpg,gif,svg}'],
                    dest: '_final/assets/'
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
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');


    grunt.registerTask('development', ['watch']);
    grunt.registerTask('build_vendor', ['concat:vendor']);
    grunt.registerTask('wrap_it_up', ['concat:vendor', 'uglify', 'cssmin', 'htmlmin', 'copy', 'imagemin:bulid']);

};
