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
      if (requestData.trim() != "") {
        try {
          var embedID = randomString(20);

          embedJSON = JSON.parse(requestData);

          console.log(embedJSON);
          embeds[embedID] = embedJSON;

          embedJSON.id = embedID;

          response.writeHead(200, {
            'Content-Type': 'text/json'
          });
          response.end(JSON.stringify(embedJSON));
          console.log("Saved embed at ID: " + embedID);
        } catch (e) {
					response.writeHead(200, {
	          'Content-Type': 'text/json'
	        });
	        response.end("Invalid POST JSON.");
        }
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/json'
        });
        response.end("Invalid POST JSON.");
      }
    });

  } else if (url.startsWith("/embed/")) {
    var embedID = url.replace("/embed/", "").replace(".json", "");
    console.log("User requested an embed: " + embedID);

    try {
      if (!url.endsWith(".json")) {
        var html = `
      <title>` + embeds[embedID].title + `</title>
      <meta content="` + embeds[embedID].description + `" property="og:description">
			<meta content="` + embeds[embedID].image + `" property="og:image">
			<link type="application/json+oembed" href="https://discord-embed-api.herokuapp.com/embed/` + embedID + `.json" />
			<meta content="` + embeds[embedID].color + `" name="theme-color">
      ` + (embeds[embedID].banner ? `<meta name="twitter:card" content="summary_large_image">` : "");

        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.end(html + "This page isn't meant to be viewed by users.");
      } else {
        var json = {
          title: embeds[embedID].title,
          author_name: embeds[embedID].authorName,
          author_url: embeds[embedID].authorUrl,
					provider_name: embeds[embedID].providerName,
					provider_url: embeds[embedID].providerUrl
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
