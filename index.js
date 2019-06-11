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
    console.log("User created an embed: " + url);

    var requestData = "";
    request.on("data", function(data) {
      requestData += data;
    });
    request.on("end", function() {
			var embedID = randomString(20);

			console.log(JSON.parse(requestData));
	    embeds[embedID] = JSON.parse(requestData);

	    response.writeHead(200, {
	      'Content-Type': 'text/plain'
	    });
	    response.end("/embed/" + embedID);
	    console.log("Saved embed at ID: " + embedID);
    });

  } else if (url.startsWith("/embed/")) {
    var embedID = url.replace("/embed/", "").replace(".json", "");
    console.log("User requested an embed: " + embedID);

    try {
      if (!url.endsWith(".json")) {
        var html = `
      <title>` + embeds[embedID].title + `</title>
      <meta content="` + embeds[embedID].title + `" property="og:title">
      <meta content="` + embeds[embedID].description + `" property="og:description">
      <meta content="` + embeds[embedID].description + `" name="description">
      <meta content="` + embeds[embedID].imageUrl + `" property="og:image">
      <meta content="` + embeds[embedID].color + `" name="theme-color">

      ` + (embeds[embedID].banner ? `<meta name="twitter:card" content="summary_large_image">` : "") + `

      <link type="application/json+oembed" href="https://discord-embed-api.herokuapp.com/embed/` + embedID + `.json" />
      `;

        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.end(html + "This page isn't meant to be viewed by users.");
      } else {
        var json = {
          provider_name: embeds[embedID].providerName,
          provider_url: embeds[embedID].providerUrl,
          author_name: embeds[embedID].authorName,
          author_url: embeds[embedID].authorUrl,
          type: (embeds[embedID].banner ? "photo" : "")
        };
        response.writeHead(200, {
          'Content-Type': 'text/json'
        });
        response.end(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error(e);
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end("The embed you requested is invalid or no longer exists.");
    }
  } else {
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    fs.createReadStream("./index.html").pipe(response);
    return;
  }
}).listen(process.env.PORT || 5000);

console.log("Server started!");
