var database = require('./database'), // store boards key = userid
	currentGame = {}, // store games by gameId, with both userIds as values
	connections = {};

var async = require('async'),
  randomstring = require("randomstring");

var battleships = {
	start: function(cb) {
		console.log('Server Running'); // init
		database.tearDown(cb);
		// cb(null); // fire protocols
	},
	stopUserByStreamId: function(streamId) {
		database.findUser({streamId: streamId}, function(err, user) {
			if(err) throw(err);
			user.status = 'offline';
			user.save();
			delete connections[user.username];
		});
	},
	initUser: function (userObj, peer) {
		console.log('game started:', userObj);
		database.addUser(userObj, function(err, data) {
			connections[userObj.username] = peer;
			// battleships.getNextGame(userObj);

		});
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
	startNewGame: function(user1, user2, cb) {
		// wait for 2 users before firing callback
		var gameId = randomstring.generate(7);
		currentGame[gameId] = [user1.username, user2.username];
		var gameObj = {
			gameId: gameId,
			users: [user1.username, user2.username]
		}
		database.addGame(gameObj, function(err, data) {
			connections[user1.username].emit('gameStart',{gameId: gameId, myTurn: true});
			connections[user2.username].emit('gameStart',{gameId: gameId, myTurn: false});
			cb();
		});

	},
	getNextGame: function() {
		// count all pending users
		database.findPendingUsers(function(err, users) {
			if(users.length < 2) {
				return setLoop(); // not enough users waiting, so just wait a bit
			}

			console.log('users:',users.length);
			battleships.startNewGame(users[0],users[1], function(err, res) {
				console.log(err, res);
				setLoop();
			});
		});
	}
};

var gameLoop;
setLoop();
function setLoop() {
	setTimeout(battleships.getNextGame,1000);
}

module.exports = battleships;