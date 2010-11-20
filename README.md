## Stream-o-Tweet ##

Drawing heavily from examples in the wild, this streams a tweet using socket.io and node-twitter.

### Dependencies: ###

- [socket.io](https://github.com/LearnBoost/Socket.IO-node)
- [node-twitter](https://github.com/technoweenie/twitter-node)

__Install them using [npm](https://github.com/isaacs/npm) !__
  <code>npm install twitter-node socket.io</code>

server.js makes the assumption you are storing your modules from:
  <code>/usr/local/lib/node</code>
  
### Usage ###

<code>node server.js <twitter_username> <twitter_password> </code>