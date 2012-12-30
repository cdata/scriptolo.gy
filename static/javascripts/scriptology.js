requirejs.config({
  baseUrl: 'javascripts',
  //urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'jquery': 'support/jquery',
    'underscore': 'support/lodash',
    'backbone': 'support/backbone',
    'marked': 'support/marked',
    'q': 'support/q',
    'handlebars': 'support/handlebars',
    'highlight': 'support/highlight',
    'typekit': '//use.typekit.net/evf4jpj'
  },
  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
    'handlebars/templates': {
      deps: ['handlebars'],
      exports: 'Handlebars.templates'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
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
  try {
    var result = q.defer();
    var typekitLoads = result.promise;

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

  typekitLoads.then(function() {
    window.scriptology = new App();
  });
});
