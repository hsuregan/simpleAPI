var jwt = require('jsonwebtoken');
var config = require('./config.js');


module.exports = function(req, res, next) {

	//check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.heads['x-access-token'];

	//decode token
	if(token) {
		jwt.verify(token, config.secret, function(err, decoded){
			if(err) {
				return res.json({success: false, message: "Failed to authenticate token."});
			} else {
				req.decoded = decoded;
				next();
			}
		}); 
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}

}