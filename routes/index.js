var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var mongoose = require('mongoose');

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

			console.log(hash);

			bcrypt.compare(req.body.password, hash, function(err, res){
				if(res) {
					console.log("yay");
				}
			})

			user.save(function(err) {
				if(err) throw err;
				console.log('User saved!');
				res.json({ success:true});
			})

		})
	});

});

module.exports = router;
