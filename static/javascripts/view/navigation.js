define(['view', 'jquery'],
       function(View, $) {
  return View.extend({
    templateName: 'navigation.handlebars',
    tagName: 'nav',
    events: {
      'click a': 'navigate'
    },
    render: function() {
      View.prototype.render.apply(this, arguments);
      this.$els = {
        items: this.$('a'),
        log: this.$('a.log'),
        projects: this.$('a.projects')
      };
      return this;
    },
    navigate: function(event) {
      var $el = $(event.currentTarget);
      var href = $el.attr('href');

      this.trigger('navigate', href);

      return false;
    }
  });
});
