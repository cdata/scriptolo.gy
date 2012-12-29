requirejs.config({
  baseUrl: 'javascripts',
  //urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'jquery': 'support/jquery',
    'underscore': 'support/lodash',
    'backbone': 'support/backbone',
    'marked': 'support/marked',
    'q': 'support/q',
    'handlebars': 'support/handlebars'
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
    }
  }
});

require(['app'], function(App) {
  window.scriptology = new App();
});
