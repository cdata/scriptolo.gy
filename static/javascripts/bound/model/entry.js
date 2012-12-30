define(['bound/model', 'marked', 'jquery'],
       function(Model, marked, $) {
  var markdownImageMatcher = /^!\[[^\]]*\]\([^\)]*\)/i;
  return Model.extend({
    defaults: function() {
      return {
        path: '',
        content: '',
        slug: '',
        leader: '',
        meta: {}
      }
    },
    getMarkdownAsHTML: function() {
      try {
        return marked(this.get('content'));
      } catch(e) {}

      return '';
    },
    parse: function(response) {
      var ast = marked.lexer(response.content);
      var first = ast[0];
      var fragment;
      var image;
      var leader;
      var index;

      if (first.type === 'code') {
        ast = ast.slice(1);
      }

      index = 0;

      if (markdownImageMatcher.test(ast[index].text)) {
        image = marked.parser([ast[index]]);
        ++index;
      }

      while(ast[index] && !leader) {
        if (ast[index].type === 'paragraph') {
          leader = marked.parser([ast[index]]);
        }
      }

      if (leader) {
        fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement('div'));
        fragment.firstChild.innerHTML = leader;
        leader = fragment.firstChild.getElementsByTagName('p')[0].innerHTML;
      }

      response.content = marked.parser(ast);
      response.leader = leader;
      response.image = image;

      return response;
    },
    sync: function(method, model, options) {
      options = _.defaults(options || {}, {
        success: $.noop,
        error: $.noop
      });

      var bound = this.collection.bound;

      bound.getItem(this.get('path')).then(
        _.bind(function(text) {
          var response = {
            path: this.get('path'),
            content: text
          };
          options.success(response, 200, bound);
          this.trigger('sync', this, response, options);
        }, this),
        _.bind(function(error) {
          options.error(this, bound, options);
          this.trigger('error', this, bound, options);
        }, this));

      this.trigger('request', model, bound, options);
    }
  });
});
