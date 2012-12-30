define(['underscore', 'view', 'backbone', 'disqus'],
       function(_, View, Backbone, disqus) {

  return View.extend({
    templateName: 'log-entry',
    tagName: 'article',
    events: {
    },
    modelBindings: {
      'change:content': 'render'
    },
    initialize: function() {
      console.log(this.model);
      this.model && this.model.fetch();
    },
    dispose: function() {
      View.prototype.dispose.apply(this, arguments);
      disqus.unload();
    },
    render: function() {
      View.prototype.render.apply(this, arguments);

      if (this.model && this.model.id) {
        disqus.load({
          fragment: Backbone.history.fragment
        });
      }

      window.scrollTo(0, this.$el.offset().top);

      return this;
    },
    navigate: function(event) {
      var href = $(event.currentTarget).attr('href');
      scriptology.navigate(href, { trigger: true });
      return false;
    }
  });
});
