module.exports = function(grunt) {
  'use strict';
  var project = 'scriptology';

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bound-publish');

  grunt.initConfig({
    watch: {
      templates: {
        files: [
          'templates/**/*.handlebars'
        ],
        tasks: ['handlebars']
      },
      javascripts: {
        files: [
          'static/javascripts/**/*.js',
          '!static/javascripts/' + project + '-release.js'
        ],
        tasks: ['requirejs']
      },
      stylesheets: {
        files: [
          'static/stylesheets/**/*.css',
          '!static/stylesheets/' + project + '-release.css'
        ],
        tasks: ['cssmin']
      }
    },
    bound: {
      publish: {
        configPath: 'bound.json'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: 'templates',
          amd: true,
          processName: function(filename) {
            return filename.replace(/^templates\//, '');
          }
        },
        files: {
          'static/javascripts/support/templates.js': [
            'templates/**/*.handlebars'
          ]
        }
      }
    },
    cssmin: {
      combine: {
        files: [{
          dest: 'static/stylesheets/' + project + '-release.css',
          src: [
            'static/stylesheets/support/normalize.css',
            'static/stylesheets/support/highlight.css',
            'static/stylesheets/**/*.css',
            '!static/stylesheets/' + project + '-release.css'
          ]
        }]
      }
    },
    requirejs: {
      compile: {
        options: {
          name: project,
          baseUrl: 'static/javascripts',
          mainConfigFile: 'static/javascripts/' + project + '.js',
          out: 'static/javascripts/' + project + '-release.js'
        }
      }
    }
  });
};
