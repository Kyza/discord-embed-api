async function get(id) {
  let settings;
  try {
      settings = await client.query(
          q.Get(
              q.Match(
                  q.Index("banIndex"),
                  id
              )
          )
      ) 
      } catch (error) {
          return false
      }
  return settings
}

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}


const faunadb = require('faunadb'),
  q = faunadb.query,
  client = new faunadb.Client({ secret: process.env.FAUNA_KEY })

  function randomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function write(obj) {
    await client.query(
        q.Create(
            q.Collection('embedCollection'),
            { data: obj },
        )
        )
  }

module.exports = async (request, response) => {
var url = decodeURIComponent(request.url);
  // Getting the IP hash for moderation purposes.
  // This is only needed during embed creation.
  var ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);

  console.log(ip.hashCode() + " created an embed: " + url);

  var requestData = "";
  requestData = request.body;
  console.log(requestData)
    if (requestData != "") {
      try {
        var embedID = randomString(10);

        embedJSON = requestData;

        embedJSON.id = embedID;

        embedJSON.creator = ip.hashCode()
        if (await get(embedJSON.creator)) {
          response.writeHead(200, {
            "Content-Type": "text/json"
          });
          response.end(JSON.stringify({id: 'banned', aa:'You have been banned from this service.'}));
          console.log('User is banned.')
        } else{
        await write(embedJSON)

        response.writeHead(200, {
          "Content-Type": "text/json"
        });
        response.end(JSON.stringify(embedJSON));
        console.log("Saved embed at ID: " + embedID);
      }
      } catch (e) {
        response.writeHead(200, {
          "Content-Type": "text/json"
        });
        response.end("Invalid POST JSON." + e);
      }
    } else {
      response.writeHead(200, {
        "Content-Type": "text/json"});
      response.end("Invalid POST JSON.");
    }
}
