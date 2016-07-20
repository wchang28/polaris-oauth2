var express = require('express');
var Client = require('./client');
var Aes256 = require('./aes256');
var reCaptchaVerify = require('./recaptcha');

var router = express.Router();

router.use('/oauth2', require('./oauth2'));

router.use('/ui', require('./ui'));

function clientMiddleware(req, res, next) {
	var data = req.body;
	// data.p
	var aes256 = new Aes256(req.cipherSecret);
	var params = JSON.parse(aes256.decrypt(data.p));
	var client_id = params.client_id;
	var redirect_uri = params.redirect_uri;
	req.parameters = params;
	req.client = new Client(req.authorizeBaseEndpoint, client_id, redirect_uri, null);
	next();
}

router.use('/client', reCaptchaVerify, clientMiddleware, require('./clientApp'));

module.exports = router;