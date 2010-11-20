// Dependencies
require.paths.unshift('/usr/local/lib/node');

var http = require('http'),
    sys = require('sys'),
    fs = require('fs'),
    TwitterNode = require('twitter-node').TwitterNode,
    io = require('socket.io');
    
// Command line args
var USERNAME = process.ARGV[2];
var PASSWORD = process.ARGV[3];

if (!USERNAME || !PASSWORD)
  return sys.puts("To use, enter the following: node server.js <twitter_username> <twitter_password>");

// 1. HTTP server
var server = http.createServer(function (req, res) {
  // var uri = url.parse(req.url).pathname;
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile("index.html", function (err, data) {
    if (err) throw err;
    res.write(data);
    res.end();
  });
});

server.listen(4000);
console.log('Server has started on port http://localhost:4000');

var twit = new TwitterNode({user: USERNAME, password: PASSWORD}),
    io = io.listen(server);

// 2. socket.io
io.on('connection', function (client) {
  // Send the tweet objects directly to the client.
  var tweetReceived = function (tweet) {
    client.send(tweet);
  };
  twit.addListener('tweet', tweetReceived);

  client.on('disconnect', function () {
    twit.removeListener('tweet', tweetReceived);
    client.broadcast({ announcement: 'Twitter Client Disconnected' });
  });
});

// 3. Twitter client.
twit.track('obama');
twit.addListener('error', function (err) { 
  console.log(err.message); // Log any error
});
twit.addListener('tweet', function (tweet) { 
  sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);  // Log any tweet to terminal
});

// Start'er up.
twit.stream();