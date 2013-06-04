// initialise server with available protocols

var innerServer = require('./lib/server'),
	dnode = require('dnode');

// any initial startup
innerServer.start(function(err) {
	if(err) throw err;
	var server = dnode({
		startGame : function (userId, cb) {
			console.log('game started:', userId);
			cb('game1');
		}
	});

	server.listen(5004);
});