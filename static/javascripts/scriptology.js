(function(global) {
  'use strict';

  requirejs.config({
    baseUrl: 'javascripts',
    paths: {
      'jquery': 'support/jquery',
      'underscore': 'support/underscore',
      'backbone': 'support/backbone',
      'marked': 'support/marked',
      'q': 'support/q',
      'handlebars': 'support/handlebars',
      'templates': 'support/templates',
      'highlight': 'support/highlight',
      '999': 'support/999',
      'bound': 'support/bound'
    },
    shim: {
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'handlebars': {
        exports: 'Handlebars'
      },
      'templates': {
        deps: ['handlebars']
      },
      'marked': {
        exports: 'marked'
      },
      'typekit': {
        exports: 'Typekit'
      },
      'highlight': {
        exports: 'hljs'
      }
    }
  });

  require(['app'], function(App) {
    window.scriptology = new App();
  });
})(this);
