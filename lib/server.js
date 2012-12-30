var express = require('express');
var app = express();

app.use(express.static('./static'));

app.get('/*', function(request, response) {
  console.log(response);
  response.sendfile('./static/index.html');
});

app.listen(10000);
