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
      'typekit': '//use.typekit.net/evf4jpj',
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
      }
    }
  });

  require(['app', 'typekit', 'q'], function(App, Typekit, q) {
    var result;
    var typekitLoads;

    try {
      result = q.defer();
      typekitLoads = result.promise;

      setTimeout(function() {
        result.resolve();
      }, 5000);

      Typekit.load({
        active: function() {
          result.resolve();
        },
        inactive: function() {
          result.resolve();
        }
      });
    } catch(e) {
      console.error(e.toString());
    }

    typekitLoads = typekitLoads || q.resolve();

    typekitLoads.then(function() {
      window.scriptology = new App();
    });
  });
})(this);
