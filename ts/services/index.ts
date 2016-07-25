import * as express from 'express';
import * as core from 'express-serve-static-core';
import {AES256 as Aes256} from './aes256';
import {IGlobal} from '../global';
import {Router as oauth2Router} from './oauth2';
import {Router as clientAppRouter} from './clientApp';
import {Router as uiRouter} from './ui';
import {ClientAppAuthEndpoint} from '../clientAppAuthEndpoint';
import {VerifyMiddleware as reCaptchaVerifyMiddleware} from './recaptcha_mw';
import {IAppParams} from '../appParams';
import * as oauth2 from 'oauth2';

let getGlobal = (req: express.Request) : IGlobal => {return req.app.get('global');}

let router = express.Router();

router.use('/oauth2', oauth2Router);
router.use('/ui', uiRouter);

// all handlers in the '/client' needs to have a 'x-p' request header field
function clientAppCallMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
	let p = req.headers['x-p'];
	if (p) {
		let config = getGlobal(req).config;
		let aes256 = new Aes256(config.cipherSecret);
		let params:IAppParams = JSON.parse(aes256.decrypt(p));
		req["parameters"] = params;
		let appSettings: oauth2.ClientAppSettings = {client_id: params.client_id, redirect_uri: params.redirect_uri};
		req["authEndPoint"] = new ClientAppAuthEndpoint(config.authorizeEndpointOptions, appSettings);
		next();
	} else {
		res.status(400).json({'error': 'bad-request', 'error_description': 'bad request'});
	}
}

router.use('/client', reCaptchaVerifyMiddleware, clientAppCallMiddleware, clientAppRouter);

export {router as Router};