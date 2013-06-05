var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/battleships');

var userSchema = new Schema({
		username: {type: String, index: {unique: true} },
		streamId: String,
		status: {type: String, default: 'idle'},
		board: Array
	}, { _id: false });


var Users = mongoose.model('User', userSchema);


var gameSchema = new Schema({
		gameId: {type: String, index: {unique: true} },
		user1: { username: String, board: Array, totalHits: 0},
		user2: { username: String, board: Array, totalHits: 0},
		status: {type: String, default: 'running'},
		moves: Array
	}, { _id: false });


var Games = mongoose.model('Game', gameSchema);


var abstraction = {
	tearDown: function(cb) {
		Games.remove({}, function() {});
		Users.remove({}, cb);
	},
	addUser: function(userObj, cb) {
		var find = {username: userObj.username};
		userObj.status = 'pending';
		Users.findOneAndUpdate(find, userObj, { upsert: true }, cb);
	},
	findUser: function(search, cb) {
		Users.findOne(search,cb);
	},
	findPendingUsers: function(cb) {
		Users.find({status: 'pending'},cb);
	},
	addGame: function(gameObj, cb) {
		var game = new Games(gameObj);
		game.save(cb);
	},
	findGame: function(search, cb) {
		Games.findOne(search,cb);
	}

};

module.exports = abstraction;
