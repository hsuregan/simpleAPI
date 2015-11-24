var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config.js');


var router = express.Router();

router.post('/', function(req, res){
	res.json({ success:true});
})

module.exports = router;
