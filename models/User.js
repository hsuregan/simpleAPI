var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require('mongoose-relationship');


var userSchema = new Schema({
	username: { type: String, required: true, unique: true},
	hash: String,
	admin: Boolean,
	age: Number,
	city: String,
	loc: {
		type: [Number], //[long, lat] 
		index: '2d',
	},

	//when one person likes another
	like: [{type:Schema.ObjectId, ref: 'User'}],

	//many-to-many relationship, when one person doesn't like the other
	refuse: [{type:Schema.ObjectId, ref:"User", childPath:"refuse"}],

	//many-to-many relationship, when both people like each other
	matches: [{type:Schema.ObjectId, ref:"User", childPath:"matches"}]
});

userSchema.plugin(relationship, {relationshipPathName:'matches'});

var User = mongoose.model('User', userSchema);

module.exports = User;

