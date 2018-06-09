const config = require('./dbconfig');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	var token = req.cookies['x_access_token'] || req.headers['x_access_token'];
	if (typeof req.headers['x_access_token'] !== 'undefined' ||
			typeof req.headers['ajax'] !== 'undefined') {
			var api = true;
	}
	if (token) {
		jwt.verify(token, config.app.accessKey, function(error, decoded) {
		  if (error) {
				console.error('Invalid token.');
				if (api) {
					res.status(401).send({'error':'Invalid token.'});
				} else {
					res.status(401).redirect('/login');
				}
			} else {
				// Valid token
				req.user = decoded;
				next();
			}
		});
	} else {
		if (api) {
			res.status(401).send({'error':'Missing token.'});
		} else {
			res.status(401).redirect('/login');
		}
	}
};
