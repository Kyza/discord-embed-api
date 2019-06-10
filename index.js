var http = require('http');

var embeds = {};

function randomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

http.createServer(function(req, res) {

  console.log(req);

  embeds[randomString(10)] = randomString(5);

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end("I'm gonna send back an embed with this info:", embeds);
}).listen(process.env.PORT || 5000);

console.log("Server started!");
