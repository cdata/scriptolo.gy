var q = require('q');
var fs = require('q-io/fs');
var path = require('path');
var _ = require('lodash');

function Bound(options) {
  options = _.defaults(options || {}, {
    configPath: './bound.json'
  });

  this.configPath = path.resolve(options.configPath);
}

Bound.prototype.readConfig = function() {
  return fs.read(this.configPath);
};

Bound.prototype.readTree = function(root) {
  /*{
    name: 'foo',
    leaves: [],
    nodes: []
  }*/
  return fs.listTree(path.resolve(root)).then(function(flat) {

  });
};

Bound.prototype.generateOutput = function() {

};

var bound = new Bound();

bound.readTree('./static').then(function(out) {
  console.log(out);
});

