var express = require('express');
var User = require('../models/User');
var mongoose = require('mongoose');
var geolib = require('geolib');
var relationship = require('mongoose-relationship');


var router = express.Router();

router.post('/', function(req, res){
	res.json({ success:true});
})

router.post('/all', function(req, res){
	User.find({}, function(err, users){
		if(err) {
			res.json({success: false});
		} else {
			res.json(users);
		}
	});
})

router.post('/delete', function(req, res){
	User.findOne({username:req.body.username}, function(err, user){
		user.remove(function(err){
			res.json({success:true});
		});
	})
})

//algorithm to update current coordinates and current city consistently



//pass in a longitude and a latitude, return the closest people
//pass in your id


router.post('/closest', function(req, res){
	//filter out matched ones
				//TODO: if dislike, ignore
			//TODO: if liked, ignore
	User.find({city:req.body.city, matches:{$ne: req.body.id}}).limit(10).lean().exec(function(err, usersSameCity) {
		//retrieve closest people
		console.log(usersSameCity);
		var ordered = geolib.orderByDistance(req.body, usersSameCity);
		var indexes = [];
		for(var i = 0; i < ordered.length; i++) {
			indexes.push(ordered[i]['key']);
		}
		//order closest people according to distance
		var orderedUsers = [];
		for(var i = 0; i < indexes.length; i++) {

			orderedUsers.push(usersSameCity[indexes[i]])
		}
		res.json(orderedUsers);
		return
	})

})

//temporarily matches people
//pass in your id (id1)
//pass in your match's id (id2)
router.post('/match', function(req, res){
	User.findOne({_id:req.body.id1}, function(err, me){
		User.findOne({_id:req.body.id2}, function(err, other){
			if(err || other == null) {
				res.json({success:false});
				return
			}

			//if they like each other, don't do anything
			if(me.matches.indexOf(other.id) >= 0) {
				res.json({success:false, message: "They like each other already."});
				return
			} else {
				me.matches.push(other);
				me.save();
				res.json({success:true});
			}
		})
	})
})

module.exports = router;
