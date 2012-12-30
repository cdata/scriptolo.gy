define(['view'],
       function(View) {
  return View.extend({
    templateName: 'archive-leader',
    tagName: 'li',
    events: {
      'click a': 'navigate'
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
