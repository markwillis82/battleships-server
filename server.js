// initialise server with available protocols

var innerServer = require('./lib/server'),
	dnode = require('dnode');

// any initial startup
innerServer.start(function(err) {
	if(err) throw err;
	var server = dnode({
		startGame : innerServer.startGame,
		nextMove : innerServer.nextMove
	}).listen(5004);
});