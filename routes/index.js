var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res){
	if(!req.body.user || !req.body.pass) {
		res.send('Username and password are both required!');
		return;
	}
})

router.post('/register', function(req, res) {
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(req.body.password, salt, function(err, hash){
			var user = new User({
				username: req.body.username,
				hash: hash
			});

			user.save(function(err) {
				if(err) throw err;
				console.log('User saved!');
				res.json({ success:true});
			})

		})
	});

});

router.post('/authenticate', function(req, res){
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if(err) throw err;
		if(!user) {
			res.json({success: false, message: 'Authentication failed.  User not found.' });
		} else if(user) {
			var hash = user.hash;
			bcrypt.compare(req.body.password, hash, function(err, result){
				if(!result) {
					res.json({success: false, message: 'Incorrect Username or Password.'});
				} else {
					var token = jwt.sign(user, config.secret);
					res.json({
						success: true,
						message: 'TOKEN',
						token: token
					});
				}
			})
		}
	}
)});

module.exports = router;
