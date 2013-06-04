// initialise server with available protocols

var innerServer = require('./lib/server'),
	dnode = require('dnode');

// // any initial startup
// innerServer.start(function(err) {
// 	if(err) throw err;
// 	var server = dnode({
// 		startGame : innerServer.startGame,
// 		nextMove : innerServer.nextMove
// 	}).listen(5004);
// });

var net = require('net');
var server = net.createServer();
var port = 20000;
server.listen(port);
server.once('listening', function() {
  console.log('Server listening on port %d', port);
});

var duplexEmitter = require('duplex-emitter');

server.on('connection', function(stream) {
  var peer = duplexEmitter(stream);

  // var interval =
  // setInterval(function() {
  //   peer.emit('ping', Date.now());
  // }, 1000);
  peer.on('startGame', function(userObj) {
	innerServer.startGame(userObj, peer);
  });
  peer.on('nextMove',innerServer.nextMove);
});

server.on('disconnect', function(stream) {
	console.log('byue', stream);
});