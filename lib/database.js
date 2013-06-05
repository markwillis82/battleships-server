var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/battleships');

var userSchema = new Schema({
		username: {type: String, index: {unique: true} },
		streamId: String,
		status: {type: String, default: 'pending'},
		board: Array
	}, { _id: false });


var Users = mongoose.model('User', userSchema);


var gameSchema = new Schema({
		gameId: {type: String, index: {unique: true} },
		users: {type: Array, index: true}, // users that rate an attraction up -- count this array for total up / down
		status: {type: String, default: 'running'},
		turn: {type: Number, default: 1},
		moves: Array
	}, { _id: false });


var Games = mongoose.model('Game', gameSchema);


var abstraction = {
	tearDown: function(cb) {
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
