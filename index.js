var http = require('http');

function listen(request, response) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('oof');
}

http.createServer(listen).listen();
