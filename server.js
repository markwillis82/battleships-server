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

  server.listen(port);
  server.once('listening', function() {
    console.log('Server listening on port %d', port);
  });


  server.on('connection', function(stream) {
    stream.id =  randomstring.generate();
    var peer = duplexEmitter(stream);
    console.log('Stream Started:', stream.id);

    // var interval =
    // setInterval(function() {
    //   peer.emit('ping', Date.now());
    // }, 1000);
    peer.on('startGame', function(userObj) {
      userObj.streamId = stream.id;
      innerServer.initUser(userObj, peer);
    });
    peer.on('nextMove',innerServer.nextMove);

    // stream.on('close', function() {
    //   console.log('peer closed');
    // });

    stream.on('end', function() {
      console.log('peer ended', stream.id);
      innerServer.stopUserByStreamId(stream.id);
    });

    stream.on('error', function(err) {
      console.log('peer died', err);
      innerServer.stopUserByStreamId(stream.id);
    });
  });

  server.on('end', function(stream) {
    console.log('byue', stream);
  });
  server.on('close', function(stream) {
    console.log('byue', stream);
  });

});
