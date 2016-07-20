var $ = require('jquery-no-dom');

var err_captcha_err = {"error": "captcha_error", "error_description":"captcha cannot verify user is a real person"};

module.exports = function(req, res, next) {
	var data = req.body;
	if (data && data["g-recaptcha-response"]) {
		var reCaptchaSettings = req.reCaptchaSettings
		var o = {
			'secret': reCaptchaSettings.serverSecret
			,'response': data["g-recaptcha-response"]
			,'remoteip': req.connection.remoteAddress
		};
		$.post(reCaptchaSettings.url, o, null, 'json')
		.done(function(ret) {
			var ret = JSON.parse(ret);
			if (ret.success) {
				console.log('reCaptcha verify successful');
				next();
			} else
				res.status(400).json(err_captcha_err);
		}).fail(function(err) {
			res.status(400).json(err_captcha_err);
		});
	} else
		next();
};