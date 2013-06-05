var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/battleships');

var schema = new Schema({
		username: {type: String, index: {unique: true} },
		streamId: String,
		status: {type: String, default: 'pending'},
		board: Array
	}, { _id: false });


var Users = mongoose.model('User', schema);


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
	}

};

module.exports = abstraction;
