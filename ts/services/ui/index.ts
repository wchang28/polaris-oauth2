import * as express from 'express';
import * as core from 'express-serve-static-core';
import {IGlobal} from '../../global';

let router = express.Router();

function getGlobal(req: express.Request) : IGlobal {
    return req.app.get('global');
}

router.get('/get_settings', function(req: express.Request, res: express.Response) {
	let config = getGlobal(req).config;
	var ret = {
		"companyName": config.companyName
		,"reCaptchaSiteKey": config.reCaptchaSettings.siteKey
	};
	res.jsonp(ret);
});

export {router as Router};