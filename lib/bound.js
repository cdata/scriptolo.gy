var q = require('q');
var fs = require('q-io/fs');
var path = require('path');
var _ = require('lodash');
var marked = require('marked');
var yaml = require('js-yaml');
var child = require('child_process');

function Bound(options) {
  options = _.defaults(options || {}, {
    configPath: './bound.json'
  });

  this.workingTree = process.cwd();
  this.configPath = path.resolve(options.configPath);
}

Bound.prototype.exec = function(command) {
  var result = q.defer();

  child.exec(command.join(' '), function(error, stdout, stderr) {
    if (error) {
      result.reject(error);
      return;
    }
    result.resolve(stdout);
  });

  return result.promise;
}

Bound.prototype.updateContent = function(contentPath, repository) {
  return fs.exists(contentPath).then(_.bind(function(exists) {
    if (!exists) {
      return this.exec(['git', 'clone', repository, contentPath]);
    }
  }, this)).then(_.bind(function() {
    var cwd = process.cwd();
    process.chdir(contentPath);

    return this.exec(['git', 'fetch']).then(_.bind(function() {
      return this.exec(['git', 'rebase']).then(function() {
        process.chdir(cwd);
      });
    }, this));
  }, this));
};

Bound.prototype.readConfig = function() {
  return fs.read(this.configPath).then(function(configText) {
    var config = JSON.parse(configText);
    config.root = path.normalize(config.root);
    config.content = path.normalize(config.content);
    return config;
  });
};

Bound.prototype.readTree = function(root) {
  var markdownMatcher = /\.(md|markdown)$/i;
  return fs.listTree(root).then(function(flat) {
    return _.filter(flat, function(file) {
      return markdownMatcher.test(file);
    });
  });
};

Bound.prototype.resolveFileMeta = function(path) {
  return fs.read(path).then(function(contents) {
    var tokens = marked.lexer(contents.toString());
    var first = tokens[0];

    if (first.type === 'code') {
      return yaml.load(first.text);
    }

    return {};
  });
};

Bound.prototype.resolveFileModification = function(file) {
  var result = q.defer();

  child.exec(['git',
              '--work-tree', this.workingTree,
              'log', '--format=format:%H', file].join(' '), function(error, stdout, stderr) {
    if (error) {
      result.reject(error);
      return;
    }

    result.resolve(stdout.toString().split(/\s/).length);
  });
  return result.promise;
};

Bound.prototype.resolveManifest = function() {
  return this.readConfig().then(_.bind(function(config) {
    var manifest = {
      ttl: config.ttl,
      base: config.content
    };
    var contentPath = path.join(config.root, config.content);

    return this.updateContent(contentPath, config.repo).then(_.bind(function() {
      process.chdir(config.root);
      return this.readTree(config.content).then(_.bind(function(files) {
        var contentPathParts = config.content.split(path.sep);
        var contents = {};
        var queue = q.resolve();

        manifest.contents = contents;
        _.each(files, function(file) {
          queue = queue.then(_.bind(function() {
            var fileParts = file.split(path.sep);
            var section = fileParts[contentPathParts.length];
            var data = {};

            contents[section] = contents[section] || [];
            return this.resolveFileModification(file).then(_.bind(function(modification) {
              return this.resolveFileMeta(file).then(_.bind(function(meta) {
                data.modification = modification;
                data.path = file;
                data.meta = meta;
                data.id = this.formatId(data);
                contents[section].push(data);
              }, this));
            }, this));
          }, this));
        }, this);

        return queue.then(function() {
          _.each(contents, function(files, section) {
            if (!config.sort) {
              return;
            }

            var sortKey = config.sort.key;
            var sortDirection = config.sort.direction || 'ascending';
            var sortValueType = (function() {
              return this;
            })()[config.sort.type];
            var sorted;

            sorted = _.sortBy(files, function(file) {
              var value = new sortValueType(file.meta[config.sort]);
              return file.meta[config.sort];
            });

            if (sortDirection === 'descending') {
              sorted = sorted.reverse();
            }

            contents[section] = sorted;
          });

          return manifest;
        });
      }, this));
    }, this));
  }, this));
};

Bound.prototype.formatId = function(data) {
  var id = data.meta && data.meta.title ? data.meta.title : data.path;
  return id.toLowerCase()
      .replace(/[!-\/]/g, '')
      .replace(/\s/g, '-');
};

Bound.prototype.writeManifest = function() {
  return this.resolveManifest().then(function(manifest) {
    return fs.write('bound-manifest.json', JSON.stringify(manifest));
  });
};

exports.update = function() {
  var bound = new Bound();

  return bound.writeManifest().then(function(contents) {
    console.log(new Date().toGMTString(), 'Manifest and feed generated successfully.');
  }, function(error) {
    console.error(new Date().toGMTString(), error ? error.stack : 'Failed for unknown reason.');
  }).then(function() {
    process.chdir(bound.workingTree);
  });
};
