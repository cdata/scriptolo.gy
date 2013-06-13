var express = require('express');
var bound = require('bound');
var path = require('path');
var app = express();
var secret = process.argv[2] || 'super-secret';
var port = process.argv[3] || 10000;
var index = path.resolve('./static/index.html');
var serverUpdates = null;

app.use(express.static('./static'));

app.post('/update/:secret', function(request, response) {
  if (request.params && request.params.secret === secret && !serverUpdates) {
    serverUpdates = bound.update().then(function() {
      serverUpdates = null;
    });
  }
  response.end();
});

app.get('/*', function(request, response) {
  response.sendfile(index);
});

console.log(new Date().toGMTString(), 'Starting server on port', port);

process.on('uncaughtException', function(err) {
  console.error(new Date().toGMTString(), 'Uncaught exception:', err.stack);
});

app.listen(port);
