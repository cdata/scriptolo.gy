module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-handlebars');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.initConfig({
    watch: {
      templates: {
        files: 'static/templates/*.handlebars',
        tasks: 'handlebars'
      },
      javascripts: {
        files: 'static/javascripts/**/*.js',
        tasks: 'requirejs'
      }
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
};
