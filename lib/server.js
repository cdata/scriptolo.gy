var express = require('express');
var bound = require('./bound');
var app = express();
var secret = process.argv[2] || 'super-secret';
var secretMatch = new RegExp('update/' + secret);

app.use(express.static('./static'));

app.get('/*', function(request, response) {
  if (secretMatch.test(request.url)) {
    bound.update();
    response.end();
  } else {
    response.sendfile('./static/index.html');
  }
});

console.log(new Date().toGMTString(), 'Starting server on port 10000');

app.listen(10000);
