define(['underscore', 'bound/resolver', 'bound/queueable'],
       function(_, Resolver, Queueable) {

  var Bound = Queueable.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        base: ''
      });
      Queueable.prototype.initialize.call(this, options);
      this.base = options.base;
      this.resolver = new Resolver({
        base: options.base
      });
      this.resolver.getManifest().then(function(manifest) {
        console.log('Finished reading index for', this.base, manifest);
      });
    }
  }, {
    queue: {
      NETWORK: 'network',
      RENDER: 'render'
    }
  });

  return Bound;
});
