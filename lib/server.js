var battleships = {
	start: function(cb) {
		console.log('Server Running'); // init
		cb(null); // fire protocols
	},
	nextMove: function(gameId, userId, move) {
		console.log('nextMove:',gameId, userId, move);
	}
};

module.exports = battleships;