define(['underscore', '999/view'],
       function(_, View, Queueable) {
  'use strict';
  return View.extend(Queueable.prototype);
});
