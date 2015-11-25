var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require('mongoose-relationship');


var userSchema = new Schema({
	username: { type: String, required: true, unique: true},
	hash: { type: String, required: true},
	admin: Boolean,
	location: String,
	meta: {
		age: Number,
		city: String,
	},
	matches: [{type:Schema.ObjectId, ref:"User", childPath:"matches"}]
});

userSchema.plugin(relationship, {relationshipPathName:'matches'});

// userSchema.pre('remove', function(next){
// 	console.log("remove associated matches entered");
// 	this.model('User').update(
// 		{_id: {$in: this.matches}},
// 		{$pull: {groups: this._id}},
// 		{multi: true},
// 	)
// })

var User = mongoose.model('User', userSchema);


module.exports = User;

