module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-handlebars');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-csso');
  grunt.initConfig({
    watch: {
      templates: {
        files: 'static/templates/*.handlebars',
        tasks: 'handlebars'
      },
      javascripts: {
        files: 'static/javascripts/**/*.js',
        tasks: 'requirejs'
      },
      css: {
        files: [
          'static/stylesheets/support/fontello.css',
          'static/stylesheets/scriptology.css'
        ],
        tasks: 'css'
      }
    },
    concat: {
      css: {
        src: [
          'static/stylesheets/support/normalize.css',
          'static/stylesheets/support/fontello.css',
          'static/stylesheets/support/highlight/zenburn.css',
          'static/stylesheets/scriptology.css'
        ],
        dest: 'static/stylesheets/all.css'
      }
    },
    csso: {
      'static/stylesheets/all.min.css': 'static/stylesheets/all.css'
    },
    handlebars: {
      all: {
        src: 'static/templates',
        dest: 'static/javascripts/support/handlebars/templates.js'
      }
    },
    requirejs: {
      default: {
        baseUrl: './static/javascripts',
        name: 'scriptology',
        mainConfigFile: './static/javascripts/scriptology.js',
        out: './static/javascripts/scriptology-release.js'
      }
    }
  });

  grunt.registerTask('css', 'concat csso');
};
