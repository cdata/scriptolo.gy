define(['view', 'view/archive/leader'],
       function(View, ArchiveLeader) {
  return View.extend({
    tagName: 'ol',
    className: 'archive',
    render: function() {
      View.prototype.render.apply(this, arguments);

      this.$els = {
        list: this.$el
      };
      this.$els.list.empty();
      this.model.each(function(item) {
        this.$els.list.append(new ArchiveLeader({ model: item }).render().$el);
      }, this);

      window.scrollTo(0, 0);

      return this;
    }
  });
});
