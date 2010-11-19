// Dependencies
require.paths.unshift('/usr/local/lib/node');

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    sys = require('sys'),
    TwitterNode = require('twitter-node').TwitterNode,
    io = require('socket.io');

// 1. HTTP server
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile("index.html", function (err, data) {
    if (err) throw err;
    res.write(data);
    res.end();
  });
});
server.listen(4000);
console.log('Server has started on port 4000');

var twit = new TwitterNode({user: 'your user name', password: 'your password'}),
    io = io.listen(server),
    buffer = [];

// 2. socket.io
io.on('connection', function (client) {
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });

  // Send the tweet objects directly to the client.
  var tweetReceived = function (tweet) {
    client.send(tweet);
  };
  twit.addListener('tweet', tweetReceived);

  // Let's send stuff to the client
  // Missing something here ..
  client.on('message', function (message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    client.broadcast(msg);
  });

  client.on('disconnect', function () {
    twit.removeListener('tweet', tweetReceived);
    client.broadcast({ announcement: 'Twitter Client Disconnected' });
  });
});

// 3. Twitter client.
twit.track('obama'); // Track user TODO: Replace with argument
twit.addListener('error', function (err) { 
  console.log(err.message); // Log any error
});
twit.addListener('tweet', function (tweet) { 
  console.log("Tweet received: " + tweet.id_str); // Log responses
});

// Start'er up.
twit.stream();