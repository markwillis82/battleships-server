var gameBoards = {}, // store boards key = userid
	currentGame = {}; // store games by gameId, with both userIds as values


var battleships = {
	start: function(cb) {
		console.log('Server Running'); // init
		cb(null); // fire protocols
	},
	startGame: function (userObj, cb) {
		console.log('game started:', userObj);
		gameBoards[userObj.username] = userObj.board;

		battleships.getNextGame(userObj, cb);
	},
	nextMove: function(gameId, userId, move, cb) {
		console.log('nextMove:',gameId, userId, move);
		console.log(gameBoards);
		cb({x: 10, y: 5});
	},
	getNextGame: function(userObj, cb) {
		var readyUsers = [];
		for(var username in gameBoards) {
			readyUsers.push(username);
		}

		console.log('gameBoards:',readyUsers.length);

		if(readyUsers.length < 2) {
			return setTimeout(function() {
				battleships.getNextGame(userObj, cb);
			},1000);
		}

		// wait for 2 users before firing callback
		var gameId = 'game';
		currentGame[gameId] = readyUsers;

		var currentTurn = readyUsers[0],
			myTurn = false;
			console.log(userObj, currentTurn);
		if(userObj.username == currentTurn) myTurn = true; // if it's the first persons turn - we go

		cb({gameId: gameId, myTurn: true});
	}
};

module.exports = battleships;