define(['jquery', 'q'], function($, Q) {
  'use strict';

  var typekitUrl = '//use.typekit.net/evf4jpj.js';
  var offline = window.SCRIPTOLOGY_OFFLINE_MODE;
  var loads;

  if (offline) {
    loads = Q.resolve();
  } else {
    loads = Q.resolve($.getScript(typekitUrl)).then(function() {
      var result = Q.defer();

      Typekit.load({
        active: function() {
          result.resolve();
        },
        inactive: function() {
          result.resolve();
        }
      });

      return result.promise;
    });
  }

  return {
    loads: loads
  };
});
