var express = require('express');
var router = express.Router();

router.post('/get_client', function(req, res) {
	req.client.getConnectedApp(function(err, connectedApp) {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(connectedApp);
	});
});

router.post('/lookup_user', function(req, res) {
	var data = req.body;
	// data.username
	var username = data.username;
	req.client.lookupUser(username, function(err, data) {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// login post - login UI will make this call when the "Login" button is pressed
router.post('/login', function(req, res) {
	console.log('hitting /login');
	var data = req.body;
	//console.log(JSON.stringify(data));
	// data.username, data.password, data.signUpUser
	var signUpUser = (data.signUpUser ? true : false);
	var params = req.parameters;
	var response_type = params.response_type;
	req.client.userLogin(response_type, data.username, data.password, signUpUser, function(err, ret) {
		if (err)
			res.status(400).json(err);
		else {
			var user = ret.user;
			var redirectUrl = req.client.redirect_uri;
			if (response_type === 'code') {	// response_type is auth code => put auth code in url query string
				redirectUrl += '?code=' + encodeURIComponent(ret.code);
			} else if (response_type === 'token') {	// response_type is 'token' => put access token in url fragment (#)
				var access = ret.access;
				redirectUrl += '#';
				var a = [];
				for (var fld in access)
					a.push(encodeURIComponent(fld) + '=' + encodeURIComponent(access[fld]));
				redirectUrl += a.join('&');
			}
			if (params.state) redirectUrl += '&state=' + encodeURIComponent(params.state);	// add application state info
			console.log('redirecting browser to ' + redirectUrl);
			//res.redirect(redirectUrl);
			res.jsonp({redirect_url: redirectUrl});
		}
	});
});

// start password reset process
// this send a PIN to user's email
router.post('/sspr', function(req, res) {
	var data = req.body;
	// data.username
	var username = data.username;
	req.client.SSPR(username, function(err, data) {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// reset password
router.post('/reset_password', function(req, res) {
	var data = req.body;
	// data.pin
	var pin = data.pin;
	req.client.resetPassword(pin, function(err, data) {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// create a new account and sign up for the client app
router.post('/sign_up_new_user', function(req, res) {
	var data = req.body;
	// data.firstName
	var firstName = data.firstName;
	var lastName = data.lastName;
	var accountOptions = {
		firstName: data.firstName
		,lastName: data.lastName
		,username: data.username
		,password: data.password
		,companyName: data.companyName ? data.companyName : null
		,mobilePhone: data.mobilePhone
		,promotionalMaterial: data.promotionalMaterial
	}
	req.client.signUpNewUser(accountOptions, function(err, data) {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

module.exports = router;