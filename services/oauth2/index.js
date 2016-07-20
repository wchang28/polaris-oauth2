var express = require('express');
var Client = require('../client');
var Aes256 = require('../aes256');

var router = express.Router();

var err_bad_response_type = {"error": "unsupported_response_type", "error_description":"response type is not supported"};
var err_bad_grant_type = {"error": "unsupported_grant_type", "error_description":"grant type not supported"};

// token grant handler
// this handler always returns http status code of 400 if there is some sort of error
// grant_type = password || refresh_token || authorization_code
// POST form data
router.post('/token', function(req, res) {
	var data = req.body;
	console.log('token grant call. data = ' + JSON.stringify(data));
	function onError(err) {res.status(400).json(err);}
	try	{
		if (data) {
			if (!data.grant_type || data.grant_type.length == 0) throw err_bad_grant_type;
			var client = new Client(req.authorizeBaseEndpoint, data.client_id, data.redirect_uri, data.client_secret);
			switch(data.grant_type) {
				case "password": {
					client.userLogin('token', data.username, data.password, false, function(err, ret) {
						if (err)
							onError(err);
						else
							res.jsonp(ret.access);
					});
					break;
				}
				case "refresh_token": {
					client.refreshToken(data.refresh_token, function(err, access) {
						if (err)
							onError(err);
						else
							res.jsonp(access);						
					});
					break;
				}
				case "authorization_code": {
					client.getAccessFromAuthCode(data.code, function(err, access) {
						if (err)
							onError(err);
						else
							res.jsonp(access);						
					});
					break;
				}
				default:
					throw err_bad_grant_type;
			}
		} else {
			throw err_bad_grant_type;
		}
	} catch(err) {
		onError(err);
	}
});

// authorization work flow entry point
router.get('/authorize', function(req, res) {
	var query = req.query;
	//query.response_type = "code" || "token"
	//query.client_id
	//query.redirect_uri
	//query.state (optional)
	console.log('hitting /authorize =>' + JSON.stringify(query));
	function onError(err) {
		var ar = [];
		for (var f in err)
			ar.push(encodeURIComponent(f) + '=' + encodeURIComponent(err[f]));
		res.status(400).end(ar.join('&'));
	}
	var response_type = query.response_type;
	if (!response_type || response_type.length === 0 || (response_type !== 'code' && response_type !== 'token'))
		onError(err_bad_response_type);
	else {
		var client = new Client(req.authorizeBaseEndpoint, query.client_id, query.redirect_uri, null);
		client.getConnectedApp(function(err, connectedApp) {
			if (err)
				onError(err);
			else {
				var params = {client_id: query.client_id, redirect_uri: query.redirect_uri, response_type: query.response_type, time_stamp: new Date()};
				if (query.state) params['state'] = query.state;
				var aes256 = new Aes256(req.cipherSecret);
				var encryptd = aes256.encrypt(JSON.stringify(params));
				// redirect user's browser to login screen
				var redirectUrl = '../../login' + '?p=' + encodeURIComponent(encryptd);
				res.redirect(redirectUrl);
			}
		});
	}
});

module.exports = router;