define(['underscore', 'jquery', 'backbone', 'bound', 'view/body', 'view/log', 'view/log/entry', 'view/projects', 'view/archive', 'marked', 'highlight'],
       function(_, $, Backbone, Bound, Body, Log, LogEntry, Projects, Archive, marked, highlight) {
  return Backbone.Router.extend({
    routes: {
      '': 'index',
      'log': 'log',
      'log/:entry': 'log',
      'projects': 'projects',
      'projects/:entry': 'projects',
      'archive': 'archive'
    },
    initialize: function() {
      this.bound = new Bound();
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
      var ViewClass = entry ? LogEntry : Log;
      this.setActive(section);
      this.body.showSection('log', ViewClass, entry);
    },
    projects: function(entry) {
      this.setActive('projects');
      this.body.showSection('projects', Projects, entry);
    },
    archive: function() {
      this.setActive();
      this.body.showSection('log', Archive).then(_.bind(function() {
      }, this));
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
