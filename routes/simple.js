var express = require('express');
var User = require('../models/User');
var mongoose = require('mongoose');
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
