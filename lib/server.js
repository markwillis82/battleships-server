var users = {}, // store boards key = userid
	currentGame = {}, // store games by gameId, with both userIds as values
	connections = {};

var async = require('async');

var battleships = {
	start: function(cb) {
		console.log('Server Running'); // init
		cb(null); // fire protocols
	},
	stopUserByStreamId: function(streamId) {
		for(var username in users) {
			var item = users[username];
			console.log(item);
			if(item.streamId == streamId) {
				console.log('delete this', item);
				delete users[username];
				delete connections[username];
				// and end game
			}
		}
	},
	startGame: function (userObj, peer) {
		console.log('game started:', userObj);
		users[userObj.username] = userObj;
		connections[userObj.username] = peer;
		battleships.getNextGame(userObj);
	},
	nextMove: function(turnInfo) {
		console.log('nextMove:',turnInfo);
		// is it a hit or not?
		// update scores
		// emit to all gamers
		currentGame[turnInfo.gameId].forEach(function(username) {
			connections[username].emit('gotMove', {username: turnInfo.username, hit: false, pos: turnInfo.move });
		});
	},
	getNextGame: function(userObj, cb) {
		var readyUsers = [];
		for(var username in users) {
			readyUsers.push(username);
		}

		console.log('users:',readyUsers.length);

		if(readyUsers.length < 2) { // better pending loop needed
			return setTimeout(function() {
				battleships.getNextGame(userObj, cb);
			},1000);
		}

		// wait for 2 users before firing callback
		var gameId = 'game';
		currentGame[gameId] = readyUsers;

		var currentTurn = readyUsers[0],
			myTurn = false;

		if(userObj.username == currentTurn) myTurn = true; // if it's the first persons turn - we go

		connections[userObj.username].emit('gameStart',{gameId: gameId, myTurn: myTurn});

	}
};

module.exports = battleships;