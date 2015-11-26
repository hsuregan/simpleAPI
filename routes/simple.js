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
	User.findOne({username:'Cheese'}, function(err, user){
		user.remove(function(err){
			res.json({success:true});
		});
	})
})

//algorithm to update current coordinates and current city consistently



//find people close by
//define a model: location
//location stores coordinate, and city
//post command gets lat, long, city
//filters long for city, 
router.post('/closest', function(req, res){
	//all within one city, then sort closest using geolib
	User.find({city:req.body.city}).limit(10).lean().exec(function(err, usersSameCity) {
		var ordered = geolib.orderByDistance(req.body, usersSameCity);
		var indexes = [];
		for(var i = 0; i < ordered.length; i++) {
			indexes.push(ordered[i]['key']);
		}
		var orderedUsers = [];
		for(var i = 0; i < indexes.length; i++) {
			orderedUsers.push(usersSameCity[indexes[i]])
		}
		console.log(usersSameCity);
		res.json(orderedUsers);
		return
	})

})


//temporarily matches people
router.post('/match', function(req, res){
	User.findOne({username:'Cheese'}, function(err, regan){
		User.findOne({username:'Macaroni'}, function(err, mac){
			if(err || mac == null) {
				res.json({success:false});
			}
			regan.matches.push(mac);
			regan.save();
			mac.matches.push(regan);
			mac.save();
			res.json({success:true});
		})
	})
})

module.exports = router;
