var express = require('express');
var bound = require('./bound');
var path = require('path');
var app = express();
var secret = process.argv[2] || 'super-secret';
var secretMatch = new RegExp('update/' + secret);
var index = path.resolve('./static/index.html');
var serverUpdates = null;

app.use(express.static('./static'));

app.get('/*', function(request, response) {
  if (secretMatch.test(request.url)) {
    if (!serverUpdates) {
      serverUpdates = bound.update().then(function() {
        serverUpdates = null;
      });
    }
    response.end();
  } else {
    response.sendfile(index);
  }
});

console.log(new Date().toGMTString(), 'Starting server on port 10000');

process.on('uncaughtException', function(err) {
  console.error(new Date().toGMTString(), 'Uncaught exception:', err.stack);
});

app.listen(10000);
