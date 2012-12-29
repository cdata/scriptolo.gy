define(['view', 'view/navigation', 'view/signature', 'view/projects', 'view/log', 'view/log/entry'],
       function(View, Navigation, Signature, Projects, Log, LogEntry) {
  return View.extend({
    templateName: 'body',
    initialize: function(options) {
      options = options || {};
      View.prototype.initialize.call(this, options);
      this.navigation = new Navigation();
      this.signature = new Signature();
      this.logIsAvailable = options.bound.getCollection('log').then(
          _.bind(function(LogCollection) {
        return this.log = new Log({
          model: LogCollection
        });
      }, this));
      this.projectsIsAvailable = options.bound.getCollection('projects').then(
          _.bind(function(ProjectsCollection) {
        return this.projects = new Projects({
          model: ProjectsCollection
        });
      }, this));
      this.visibleEntry = null;
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
    showLog: function(entry) {
      this.projectsIsAvailable.then(_.bind(function(projects) {
        projects.remove();
        this.$el.removeClass('projects');
      }, this));
      this.logIsAvailable.then(_.bind(function(log) {
        if (this.visibleEntry) {
          this.visibleEntry.dispose();
          this.visibleEntry = null;
        }

        this.$el.addClass('log');
        this.$el.toggleClass('entry', !!entry);

        if (entry) {
          console.log('Showing', entry);
          log.remove();
          this.visibleEntry = new LogEntry({ model: log.model.get(entry) });
          this.$els.content.append(this.visibleEntry.render().$el);
        } else {
          this.$els.content.append(log.render().$el);
        }
      }, this));
    },
    showProjects: function(entry) {
      this.logIsAvailable.then(_.bind(function(log) {
        log.remove();
        this.$el.removeClass('log');
      }, this));
      this.projectsIsAvailable.then(_.bind(function(projects) {
        if (this.visibleEntry) {
          this.visibleEntry.dispose();
          this.visibleEntry = null;
        }

        this.$el.addClass('projects');
        this.$el.toggleClass('entry', !!entry);

        if (entry) {
          projects.remove();
          //this.visibleEntry = new LogEntry({ model: log.model.at(entry) });
          //this.$els.content.append(this.visibleEntry.render().$el);
        } else {
          this.$els.content.append(projects.render().$el);
        }
      }, this));
    }
  });
});
