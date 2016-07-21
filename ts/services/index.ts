import * as express from 'express';
import * as core from 'express-serve-static-core';
import {AES256 as Aes256} from './aes256';
import {IGlobal} from '../global';
import {Router as oauth2Router} from './oauth2';
import {Router as clientAppRouter} from './clientApp';
import {Router as uiRouter} from './ui';
import {ClientAppAuthEndPoint} from '../clientAppAuthEndPoint';
import {VerifyMiddleware as reCaptchaVerifyMiddleware} from './recaptcha';
import {IAppParams} from '../appParams';
import * as oauth2 from '../oauth2';

let getGlobal = (req: express.Request) : IGlobal => {return req.app.get('global');}

let router = express.Router();

router.use('/oauth2', oauth2Router);
router.use('/ui', uiRouter);

function clientMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    let config = getGlobal(req).config;
	let data = req.body;
	// data.p
	let aes256 = new Aes256(config.cipherSecret);
	let params:IAppParams = JSON.parse(aes256.decrypt(data.p));
	req["parameters"] = params;
	let appSettings: oauth2.ClientAppSettings = {client_id: params.client_id, redirect_uri: params.redirect_uri};
    req["authEndPoint"] = new ClientAppAuthEndPoint(config.authorizeEndpointOptions, appSettings);
	next();
}

router.use('/client', reCaptchaVerifyMiddleware, clientMiddleware, clientAppRouter);

export {router as Router};