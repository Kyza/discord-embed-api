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
    while (embeds[embedID]) {
      embedID = randomString(10);
    }

    embeds[embedID] = {
      providerName: "providerName",
      providerUrl: "https://provider.url/",
      authorName: "authorName",
      authorUrl: "https://author.url/",
      title: "title",
      description: "description",
      imageUrl: "https://image.url/",
      banner: false,
      color: "#color"
    };

    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("/embed/" + embedID);
  } else if (url.startsWith("/embed/")) {
    var embedID = url.replace("/embed/", "");

    if (!url.endsWith(".json")) {
      var html = `
      <title>` + embeds[embedID].title + `</title>
      <meta content="` + embeds[embedID].title + `" property="og:title">
      <meta content="` + embeds[embedID].description + `" property="og:description">
      <meta content="` + embeds[embedID].description + `" name="description">
      <meta content="" property="og:url">
      <meta content="` + embeds[embedID].imageUrl + `" property="og:image">
      <meta content="` + embeds[embedID].color + `" name="theme-color">

      ` + (embeds[embedID].banner ? `<meta name="twitter:card" content="summary_large_image">` : "") + `

      <link type="application/json+oembed" href="./embed/` + embedID + `.json" />
      `;

      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(html);
    } else {
      embedID = embedID.replace(".json", "");
      var json = {
        provider_name: embeds[embedID].providerName,
        provider_url: embeds[embedID].providerUrl,
        author_name: embeds[embedID].authorUrl,
        author_url: embeds[embedID].authorName,
        type: (embeds[embedID].banner ? "photo" : "")
      };
      response.writeHead(200, {
        'Content-Type': 'text/json'
      });
      response.end(json);
    }
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end("Do you need something?");
  }
}).listen(process.env.PORT || 5000);

console.log("Server started!");
