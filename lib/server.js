var battleships = {
	start: function(cb) {
		console.log('Server Running'); // init
		cb(null); // fire protocols
	},
	startGame: function (userId, cb) {
		console.log('game started:', userId);
		cb('game1');
	},
	nextMove: function(gameId, userId, move) {
		console.log('nextMove:',gameId, userId, move);
	}
};

module.exports = battleships;