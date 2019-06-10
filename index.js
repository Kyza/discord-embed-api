var http = require('http');


http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Hello HTTP!');
}).listen(80);

console.log("Server started!");
