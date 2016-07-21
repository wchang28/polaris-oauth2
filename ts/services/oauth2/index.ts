import * as express from 'express';
import * as core from 'express-serve-static-core';
import {ClientAppAuthEndPoint} from '../../clientAppAuthEndPoint';
import {AES256 as Aes256} from '../aes256';
import {IGlobal} from '../../global';
import {IAppParams} from '../../appParams';
import * as oauth2 from '../../oauth2';
import * as _ from 'lodash';

let router = express.Router();

let err_bad_response_type = {"error": "unsupported_response_type", "error_description":"response type is not supported"};
let err_bad_grant_type = {"error": "unsupported_grant_type", "error_description":"grant type not supported"};

let getGlobal = (req: express.Request) : IGlobal => {return req.app.get('global');}

// token grant handler
// this handler always returns http status code of 400 if there is some sort of error
// grant_type = password || refresh_token || authorization_code
// POST form data
router.post('/token', (req: express.Request, res: express.Response) => {
	let params:oauth2.TokenGrantParams = req.body;
	console.log('token grant call. data = ' + JSON.stringify(params));
	let onError = (err: any) : void => {res.status(400).json(err);}
	try	{
		if (params) {
			if (!params.grant_type) throw err_bad_grant_type;
			let appSettings: oauth2.ClientAppSettings = {client_id: params.client_id, redirect_uri: params.redirect_uri, client_secret: params.client_secret};
			let ae = new ClientAppAuthEndPoint(getGlobal(req).config.authorizeEndpointOptions, appSettings);
			switch(params.grant_type) {
				case "password": {
					ae.userLogin('token', true, false, params.username, params.password, false, (err, ret) => {
						if (err)
							onError(err);
						else
							res.jsonp(ret.access);
					});
					break;
				}
				case "refresh_token": {
					ae.refreshToken(params.refresh_token, (err, access:oauth2.Access) => {
						if (err)
							onError(err);
						else
							res.jsonp(access);						
					});
					break;
				}
				case "authorization_code": {
					ae.getAccessFromAuthCode(params.code, (err, access:oauth2.Access) => {
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
router.get('/authorize', (req: express.Request, res: express.Response) => {
	let authParams: oauth2.AuthorizationWorkflowParams = req.query;
	console.log('hitting /authorize => ' + JSON.stringify(authParams));
	let onError = (err:any):void => {
		let ar:string[] = [];
		for (let f in err)
			ar.push(encodeURIComponent(f) + '=' + encodeURIComponent(err[f]));
		res.status(400).end(ar.join('&'));
	};
	let response_type = authParams.response_type;
	if (!response_type || (response_type !== 'code' && response_type !== 'token'))
		onError(err_bad_response_type);
	else {
		let appSettings: oauth2.ClientAppSettings = {client_id: authParams.client_id, redirect_uri: authParams.redirect_uri};
		let ae = new ClientAppAuthEndPoint(getGlobal(req).config.authorizeEndpointOptions, appSettings);
		ae.getConnectedApp((err:any, connectedApp:any) => {
			if (err)
				onError(err);
			else {
				let params:IAppParams = <IAppParams>(_.assignIn({}, authParams, {time_stamp: new Date()}));
				let aes256 = new Aes256(getGlobal(req).config.cipherSecret);
				let encryptd = aes256.encrypt(JSON.stringify(params));
				// redirect user's browser to login screen with app params in the query string
				let redirectUrl = '../../login' + '?p=' + encodeURIComponent(encryptd);
				res.redirect(redirectUrl);
			}
		});
	}
});

export {router as Router};