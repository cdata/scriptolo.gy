var express = require('express');
var app = express();

app.use(express.static('./static'));

app.get('/*', function(request, response) {
  response.sendfile('./static/index.html');
});

console.log(new Date().toGMTString(), 'Starting server on port 10000');

app.listen(10000);
