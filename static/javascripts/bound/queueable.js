define(['underscore', 'backbone', 'q'],
       function(_, Backbone, q) {
  function Queueable() {
    this.initialize.apply(this, arguments);
  }

  Queueable.prototype.initialize = function() {
    this.queueMap = {};
  };

  Queueable.prototype.queue = function(type, task, context) {
    var result;

    if (typeof task !== 'function') {
      result = task;
      task = function() {
        return result;
      };
    }

    task = _.bind(task, context || this);

    this.queueMap[type] = this.queueMap[type] || q.resolve();
    return this.queueMap[type] = this.queueMap[type].then(task);
  };

  Queueable.extend = Backbone.View.extend;

  return Queueable;
});
