import * as express from 'express';
import * as core from 'express-serve-static-core';
import {IGlobal} from '../../global';
import {IAppSettings} from '../../appParams';

let router = express.Router();

let getGlobal = (req: express.Request) : IGlobal => {return req.app.get('global');}

router.get('/get_settings', function(req: express.Request, res: express.Response) {
	let config = getGlobal(req).config;
	let ret: IAppSettings = {
		companyName: config.companyName
		,reCaptchaSiteKey: config.reCaptchaSettings.siteKey
	};
	res.jsonp(ret);
});

export {router as Router};