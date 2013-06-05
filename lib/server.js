var database = require('./database'), // store boards key = userid
	currentGame = {}, // store games by gameId, with both userIds as values
	connections = {},
	totalHitsInGame = 2;

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

			// find any games user is on and end them
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
		// get game info
		database.findGame({gameId: turnInfo.gameId}, function(err, game) {
			if(err) throw err;

			// get opponents board
			var isHit = 0,
				whatUserAmI = 'user1';
				opponent = 'user2';
			if(game.user2.username == turnInfo.username) {
				whatUserAmI = 'user2';
				opponent = 'user1';
			}

			try {
				// is it a hit or not?
				isHit = game[opponent].board[turnInfo.move.x][turnInfo.move.y];
			} catch(err) {
				// boot user for cheating
				throw(err);
			}

			turnInfo.hit = isHit;

			game.moves.push(turnInfo);

			if(isHit) game[whatUserAmI].totalHits++;
			// save
			game.save();

			// this is the end game point - no more moves as someone has one
			if(game[whatUserAmI].totalHits == totalHitsInGame) return battleships.endGame(game, whatUserAmI);

			// emit to all gamers
			currentGame[turnInfo.gameId].forEach(function(username) {
				connections[username].emit('gotMove', {username: turnInfo.username, hit: isHit, pos: turnInfo.move });
				if(username != turnInfo.username) {
					connections[username].emit('myMove');
				}
			});

		});
	},
	endGame: function(game, whoWon) {
		currentGame[game.gameId].forEach(function(username) {
			connections[username].emit('endGame', {winner: (username == whoWon ? true : false )});
		});
	},
	startNewGame: function(user1, user2, cb) {
		// wait for 2 users before firing callback
		var gameId = randomstring.generate(7);

		user1.status = 'ingame';
		user2.status = 'ingame';
		user1.save();
		user2.save();

		currentGame[gameId] = [user1.username, user2.username];
		var gameObj = {
				gameId: gameId,
				user1: {
							username: user1.username,
							board: user1.board,
							totalHits: 0
						},
				user2: {
						username: user2.username,
						board: user2.board,
						totalHits: 0
				}
			};

		database.addGame(gameObj, function(err, data) {
			// notify
			connections[user1.username].emit('gameStart', {gameId: gameId});
			connections[user2.username].emit('gameStart', {gameId: gameId});

			// broadcast first move
			connections[user1.username].emit('myMove', {gameId: gameId});
			cb(err);
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
				if(err) throw(err);
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