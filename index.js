var http = require('http');
var fs = require("fs");

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

http.createServer(function(request, response) {
  var url = decodeURIComponent(request.url);
  if (url == "/favicon.ico") {
    response.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=favicon.ico"
    });
    fs.createReadStream("./favicon.ico").pipe(response);
    return;
  } else if (url.startsWith("/create")) {
    console.log("User requested an embed: " + url);

    var embedID = randomString(10);
    embeds[embedID] = {
      providerName: "providerName",
      providerUrl: "providerUrl",
      authorName: "authorName",
      authorUrl: "authorUrl",
      title: "title",
      description: "description",
      imageUrl: "https://image.url/",
      banner: false,
      color: "#color"
    };

    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("I'm gonna send back an embed with this info: " + JSON.stringify(embeds, null, 2));
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("Do you need something?");
  }
}).listen(process.env.PORT || 5000);

console.log("Server started!");
