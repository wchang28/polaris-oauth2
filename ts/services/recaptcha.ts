import * as express from 'express';
import * as core from 'express-serve-static-core';
import {IGlobal} from '../global';
let $ = require('jquery-no-dom');

let err_captcha_err = {"error": "captcha_error", "error_description":"captcha cannot verify user is a real person"};

function getGlobal(req: express.Request) : IGlobal {
    return req.app.get('global');
}

function verifyMiddleware(req:express.Request, res: express.Response, next:express.NextFunction) {
	let data = req.body;
	if (data && data["g-recaptcha-response"]) {
		let reCaptchaSettings = getGlobal(req).config.reCaptchaSettings;
		let o:any = {
			'secret': reCaptchaSettings.serverSecret
			,'response': data["g-recaptcha-response"]
			,'remoteip': req.connection.remoteAddress
		};
		$.post(reCaptchaSettings.url, o, null, 'json')
		.done((ret) => {
			let result = JSON.parse(ret);
			if (result.success) {
				console.log('reCaptcha verify successful');
				next();
			} else
				res.status(400).json(err_captcha_err);
		}).fail((err) => {
			res.status(400).json(err_captcha_err);
		});
	} else
		next();
};

export {verifyMiddleware as VerifyMiddleware};