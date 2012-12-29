define(['underscore', 'jquery', 'q', 'bound/queueable', 'bound/model/entry', 'bound/collection'],
       function(_, $, q, Queueable, EntryModel, Collection) {
  var Bound = Queueable.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        manifest: 'manifest.json',
        base: '',
        prefix: 'BOUND::'
      });
      Queueable.prototype.initialize.call(this, options);
      this.base = options.base;
      this.manifest = this.base + '/' + options.manifest;
      this.prefix = options.prefix;
    },
    getCollection: function(section) {
      return this.getManifest().then(_.bind(function(manifest) {
        var collection = new Collection(manifest[section], {
          bound: this,
          model: EntryModel
        });

        return collection;
      }, this));
    },
    getManifest: function() {
      return this.getFromStorage(this.manifest).then(_.bind(function(text) {
        var shouldUpdate = !text;
        var now = +new Date();
        var stored;
        var manifest;
        var ttl;

        if (text) {
          stored = JSON.parse(text);
          manifest = JSON.parse(stored.value);
          ttl = manifest.ttl * 1000;

          if (stored.timestamp + ttl < now) {
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          return this.getFromNetwork(this.manifest).then(_.bind(function(text) {
            var newManifest = JSON.parse(this.unfreeze(text));

            if (manifest) {
              // Evict out-of-date items..
              _.each(newManifest.contents, function(items, section) {
                var oldSection = _.reduce(manifest[section], function(map, item) {
                  var path = this.base + '/' + section + '/' + item.path;
                  map[path] = item;
                  return map;
                }, {}, this);

                _.each(items, function(item) {
                  var path = this.base + '/' + section + '/' + item.path;
                  var oldItem = oldSection[path];
                  if (!oldItem) {
                    return;
                  }

                  if (oldItem.modification < item.modification) {
                    this.evict(path);
                  }
                }, this);
              }, this);
            }
            return newManifest.contents;
          }, this));
        }

        return manifest.contents;
      }, this)).then(_.bind(function(contents) {
        _.each(contents, function(list, section) {
          contents[section] = _.map(list, function(item) {
            return {
              path: this.base + '/' + section + '/' + item.path,
              id: item.id
            };
          }, this);
        }, this);

        return contents;
      }, this));
    },
    getItem: function(path) {
      return this.getFromStorage(path).then(_.bind(function(data) {
        if (data) {
          return data;
        }

        return this.getFromNetwork(path);
      }, this)).then(_.bind(function(text) {

        return this.unfreeze(text);
      }, this));
    },
    getFromStorage: function(path) {
      return this.lookup(path);
    },
    getFromNetwork: function(path) {
      return this.queue(Bound.queue.NETWORK, function() {
        return $.get(path, function(){}, 'text').then(_.bind(function(text) {
          text = this.freeze(text);

          this.store(path, text);

          return text;
        }, this));
      });
    },
    getStoredTime: function(path) {
      return this.queue(Bound.queue.STORAGE, function() {
        return this.lookup(path).then(function(item) {
          if (item) {
            return JSON.parse(item).timestamp;
          }
        });
      });
    },
    store: function(item, value) {
      return this.queue(Bound.queue.STORAGE, function() {
        try {
          return localStorage.setItem(this.prefix + item, value);
        } catch(e) {}
      });
    },
    lookup: function(item) {
      return this.queue(Bound.queue.STORAGE, function() {
        try {
          return localStorage.getItem(this.prefix + item);
        } catch(e) {}
      });
    },
    evict: function(item) {
      return this.queue(Bound.queue.STORAGE, function() {
        try {
          localStorage.removeItem(this.prefix + item);
        } catch(e) {}
      });
    },
    unfreeze: function(frozen) {
      return JSON.parse(frozen).value
    },
    freeze: function(value) {
      return JSON.stringify({
        timestamp: +new Date(),
        value: value
      });
    }
  }, {
    queue: {
      STORAGE: 'storage',
      NETWORK: 'network'
    }
  });

  return Bound;
});
