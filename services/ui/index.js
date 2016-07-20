var express = require('express');
var router = express.Router();

router.get('/get_settings', function(req, res) {
	var ret = {
		"companyName": req.companyName
		,"reCaptchaSiteKey": req.reCaptchaSettings.siteKey
	};
	res.jsonp(ret);
});

module.exports = router;