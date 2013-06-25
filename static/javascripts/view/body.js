define(['view', 'view/navigation', 'view/signature', 'view/projects', 'view/log', 'view/log/entry', 'view/archive'],
       function(View, Navigation, Signature) {
  return View.extend({
    templateName: 'body.handlebars',
    initialize: function(options) {
      options = options || {};
      View.prototype.initialize.call(this, options);
      this.navigation = new Navigation();
      this.signature = new Signature();

      this.bound = options.bound;
      this.currentView = null;
    },
    render: function() {
      View.prototype.render.apply(this, arguments);
      this.$els = {
        header: this.$('header'),
        content: this.$('#Content')
      };
      this.$els.header.append(this.navigation.render().$el);
      this.$el.append(this.signature.render().$el);
      return this;
    },
    showSection: function(section, ViewClass, entry) {
      return this.queue('navigate', function() {

        return this.bound.getCollection(section).then(_.bind(function(collection) {
          if (this.currentView) {
            this.currentView.dispose();
            this.currentView = null;
            this.$el.removeClass(function(index, className) {
              return className;
            });
          }

          var model = entry ? collection.get(entry) : collection;
          this.currentView = new ViewClass({ model: model });
          this.$el.addClass(section);
          if (entry) {
            this.$el.addClass('entry');
          }
          this.$els.content.append(this.currentView.render().$el);
        }, this));
      }, this);
    }
  });
});
