define(['view', 'view/archive/leader'],
       function(View, ArchiveLeader) {
  return View.extend({
    tagName: 'ol',
    render: function() {
      View.prototype.render.apply(this, arguments);

      this.$el.empty();
      this.model.each(function(item) {
        this.$el.append(new ArchiveLeader({ model: item }).render().$el);
        item.fetch();
      }, this);

      window.scrollTo(0, 0);

      return this;
    }
  });
});
