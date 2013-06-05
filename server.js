// initialise server with available protocols

var innerServer = require('./lib/server'),
	dnode = require('dnode'),
  randomstring = require("randomstring");

  var net = require('net'),
    duplexEmitter = require('duplex-emitter'),
    server = net.createServer(),
    port = 20000;


// any initial startup
innerServer.start(function(err) {

  server.listen(port); // setup tcp server

  server.once('listening', function() {
    console.log('Server listening on port %d', port);
  });


  server.on('connection', function(stream) {
    stream.id =  randomstring.generate(); // generate a unique ID for stream
    var peer = duplexEmitter(stream); // setup duplex

    console.log('Stream Started:', stream.id); // good to go

    peer.on('startGame', function(userObj) {
      userObj.streamId = stream.id; // on startGame tie stream to user
      innerServer.initUser(userObj, peer);
    });

    peer.on('nextMove',innerServer.nextMove);

    stream.on('end', function() { // delete the stream from the store when the connection drops
      console.log('peer ended', stream.id);
      innerServer.stopUserByStreamId(stream.id);
    });

    stream.on('error', function(err) { // there was a problem
      console.log('peer died', err);
      innerServer.stopUserByStreamId(stream.id);
    });
  });

});
