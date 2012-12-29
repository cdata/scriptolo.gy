define(['view', 'view/log/leader'],
       function(View, LogLeader) {
  return View.extend({
    tagName: 'ol',
    render: function() {
      View.prototype.render.apply(this, arguments);

      this.$el.empty();
      this.model.each(function(item) {
        this.$el.append(new LogLeader({ model: item }).render().$el);
        item.fetch();
      }, this);

      window.scrollTo(0, window.scrollTop);

      return this;
    }
  });
});
