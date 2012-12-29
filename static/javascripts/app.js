define(['underscore', 'jquery', 'backbone', 'bound', 'view/body', 'marked', 'highlight'],
       function(_, $, Backbone, Bound, Body, marked, highlight) {
  return Backbone.Router.extend({
    routes: {
      '': 'index',
      'log': 'log',
      'log/:entry': 'log',
      'projects': 'projects',
      'projects/:entry': 'projects'
    },
    initialize: function() {
      this.bound = new Bound({ base: 'markdown' });
      this.body = new Body({
        el: document.getElementById('Container'),
        bound: this.bound
      }).render();

      marked.setOptions({
        gfm: true,
        pedantic: false,
        sanitize: true,
        highlight: function(code, language) {
          try {
            if (language) {
              return highlight.highlight(language, code).value;
            }

            return highlight.highlightAuto(code).value;
          } catch(e) {
            console.error('Error while highlighting code.', e);
          }
        }
      });

      this.body.navigation.on('navigate', this.performNavigation, this);

      $(document.getElementsByTagName('html')[0]).addClass('scriptology');

      Backbone.history.start({
        //pushState: true
      });
    },
    index: function() {
      this.navigate('log', { trigger: true });
    },
    log: function(entry) {
      var section = entry ? '' : 'log';
      this.setActive(section);
      this.body.showLog(entry);
    },
    projects: function(entry) {
      this.setActive('projects');
      this.body.showProjects(entry);

      window.scrollTo(0, 0);
    },
    performNavigation: function(path) {
      this.navigate(path, { trigger: true });
    },
    setActive: function(section) {
      if (section) {
        this.body.navigation.$els[section]
            .addClass('active').siblings().removeClass('active');
      } else {
        this.body.navigation.$els.items.removeClass('active');
      }
    }
  });
});
