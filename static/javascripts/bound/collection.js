define(['backbone'],
       function(Backbone) {
  return Backbone.Collection.extend({
    initialize: function(models, options) {
      options = options || {};

      this.bound = options.bound;
    },
    fetch: function(options) {
      this.invoke('fetch', options);
    }
  });
});
