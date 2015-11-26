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
	console.log("entered closest router");
	User.find({city:req.body.city}).lean().exec(function(err, usersSameCity) {
		var ordered = geolib.orderByDistance(req.body, usersSameCity);
		res.json(ordered);
		return
	})

	// 	function(err, usersSameCity){
	// 	usersSameCity.toJSON();

	// 	JSON.stringify(usersSameCity, function(err, usersSameCityJson){

	// 		console.log(usersSameCityJson);

	// 		var ordered = geolib.orderByDistance(req.body, usersSameCityJson);
	// 				//res.json({success:'false'});

	// 	});//[{"_id":"56555d83ef2a4210136840bd","username":"Mary","hash":"$2a$10$X5Tx0qT.t/Lk8SMS29uouuOeb1nrHlC.bllkB9CTP6C3J.IUkpXwi","longitude":7.453619,"latitude":51.515,"city":"Austin","__v":0,"matches":[]},,{"_id":"56555d9cef2a4210136840be","username":"Ed","hash":"$2a$10$D4tDwDZ/JZgaTlUSNKaGiOByZ.N3SYga7YC2rgDyAAT0GgmCaTbDe","longitude":13.377722,"latitude":52.516272,"city":"Austin","__v":0,"matches":[]},{"_id":"56555da9ef2a4210136840bf","username":"Chris","hash":"$2a$10$.G5o2keZq.KZPXOqnlXrk.SJNJpn58lN.tObF7pMuY1tAEFExpaxe","longitude":7.45425,"latitude":51.518,"city":"Austin","__v":0,"matches":[]},{"_id":"56555dbeef2a4210136840c0","username":"Brandon","hash":"$2a$10$ke.2VPpVP3LVJcu5Rwxhle68iW4Rr85sAObABZUvA8VCDt9hFV6qK","longitude":-0.119722,"latitude":51.503333,"city":"Austin","__v":0,"matches":[]}]
	// 	//JSON.stringify(usersSameCity);
	// 	//var ordered = geolib.orderByDistance(req.body, Users);
	// 	//res.json(ordered);
	// })
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
