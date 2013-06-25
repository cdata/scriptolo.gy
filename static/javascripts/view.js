define(['underscore', '999/view', 'bound/queueable'],
       function(_, View, Queueable) {
  'use strict';
  return View.extend(new Queueable());
});
