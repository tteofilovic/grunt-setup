module.exports = function(grunt) {

  const sass = require('node-sass');

  /* * Load Grunt Plugins * */
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-terser');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      options: {
        configFile: 'eslintrc.json'
      },
      target: [
        'assets/src/js/**/*.js'
      ]
    },
    stylelint: {
      options: {
        configFile: 'stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        syntax: 'scss'
      },
      src: [
        'assets/src/sass/**/*.{css,scss}'
      ]
    },
    sass: {
      dev: {
        options: {
          implementation: sass,
        },
        files: [{
          'assets/dist/css/child-theme.min.css': ['assets/src/sass/child-theme.scss']
        }]
      },
      prod: {
        options: {
          implementation: sass,
          outputStyle: 'compressed',
          //sourceMap: true
        },
        files: [{
          'assets/dist/css/child-theme.min.css': ['assets/src/sass/child-theme.scss']
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        options: {
          map: false
        },
        files: {
          'assets/dist/css/child-theme.min.css': 'assets/dist/css/child-theme.min.css'
        }
      }
    },
    browserify: {
      dev: {
        src: [
          'assets/src/js/child-default.js'
        ],
        dest: 'assets/dist/js/child-theme.min.js',
        options: {
          transform: [
            [
              'babelify',
              {
                presets: [
                  ['@babel/preset-env',
                    {
                      targets: '> 0.25%, not dead',
                      useBuiltIns: 'usage',
                      'corejs': 3
                    }
                  ]
                ]
              }
            ]
          ],
          browserifyOptions: {
            debug: true
          }
        }
      },
      prod: {
        src: [
          'assets/src/js/child-default.js'
        ],
        dest: 'assets/dist/js/child-theme.min.js',
        options: {
          transform: [
            [
              'babelify',
              {
                presets: [
                  ['@babel/preset-env',
                    {
                      targets: '> 0.25%, not dead',
                      useBuiltIns: 'usage',
                      'corejs': 3
                    }
                  ]
                ]
              }
            ]
          ],
          browserifyOptions: {
            debug: false
          }
        }
      }
    },
    terser: {
      options: {},
      target: {
        files: {
          'assets/dist/js/child-theme.min.js': ['assets/dist/js/child-theme.min.js'],
        }
      },
    },
    watch: {
      sass: {
        files: ['assets/src/sass/**/*.scss'],
        tasks: ['stylelint', 'sass:dev', 'autoprefixer']
      },
      js: {
        files: ['assets/src/js/**/*.js'],
        tasks: ['eslint', 'browserify:dev']
      }
    }
  });

  /* * Register Tasks * */
  grunt.registerTask('default', [
    'stylelint',
    'sass:dev',
    'autoprefixer',
    'eslint',
    'browserify:dev',
  ]);

  grunt.registerTask('prod', [
    'stylelint',
    'sass:prod',
    'autoprefixer',
    'eslint',
    'browserify:prod',
    'terser'
  ]);
};
