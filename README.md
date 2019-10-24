# discord-embed-api

My API for creating custom link embeds for Discord.

Hosted with Heroku so I don't have to worry about a lot of stuff such as storing data efficiently; especially since this API does extremely minimal calculations. Everything is saved in RAM so embed links will be purged when it (probably never) uses up all of the Heroku server's allocated RAM.

# Data That's Logged

 - Embed data.
 - What embed ID that data was saved to.
 - Your IP address.

I am not responsable the releasing of any personal information within logged data.

# Why is this data logged?

## IP

Your IP address is logged to help moderate the API.

I don't allow malicious links such as:

 - IP grabbers.
 - Malware links.
 - Anything potentially harmful to any user.

In the case that this happens, the user will be IP banned from this API. You can appeal your ban or report malicious embeds on [my Discord server](https://discord.gg/c9ESSur).

## Embed Data

Embed data is logged to keep track of how much the API is used, as well as to help with any errors that may occur.

# Legal

I am not responsible for any data that passes through my API or any consequences that come with it. Anyone who uses this API surrenders the right for me to handle the data they sent. I do not sell this data to advertisers or profit off of it in any way intentionally. This data is for API moderation purposes to help keep the API ethical.
