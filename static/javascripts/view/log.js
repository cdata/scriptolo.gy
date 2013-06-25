define(['view', 'view/log/leader', 'templates', 'jquery'],
       function(View, LogLeader, templates, $) {
  return View.extend({
    tagName: 'ol',
    events: {
      'click .view-archive': 'goToArchive'
    },
    render: function() {
      View.prototype.render.apply(this, arguments);

      this.$el.empty();

      this.model.each(function(item, index) {
        if (index > 4) {
          return;
        }
        this.$el.append(new LogLeader({ model: item }).render().$el);
        item.fetch();
      }, this);

      this.$el.append(templates['view-archive.handlebars']());

      window.scrollTo(0, 0);

      return this;
    },
    goToArchive: function(event) {
      var href = $(event.currentTarget).attr('href');
      scriptology.navigate(href, { trigger: true });
      return false;
    }
  });
});
