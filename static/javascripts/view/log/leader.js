define(['view'],
       function(View) {
  return View.extend({
    templateName: 'log-leader.handlebars',
    tagName: 'li',
    events: {
      'click .read-more': 'navigate',
      'click .title': 'navigate'
    },
    modelBindings: {
      'change:content': 'render'
    },
    render: function() {
      View.prototype.render.apply(this, arguments);
      return this;
    },
    navigate: function(event) {
      var href = $(event.currentTarget).attr('href');
      scriptology.navigate(href, { trigger: true });
      return false;
    }
  });
});
