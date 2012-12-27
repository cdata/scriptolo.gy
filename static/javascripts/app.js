define(['underscore', 'backbone', 'bound'],
       function(_, Backbone, Bound) {
  return Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    initialize: function() {
      this.blog = new Bound({ base: 'markdown' });
      Backbone.history.start();
    },
    index: function() {

    }
  });
});
