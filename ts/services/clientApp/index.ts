import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as auth_client from 'polaris-auth-client';
import {IAppParams} from '../../appParams';
import * as oauth2 from 'oauth2';
import * as uiInt from '../../uiInterfaces';

let router = express.Router();

let getAuthorizationEndpoint = (req: express.Request) : auth_client.AuthClient => {return req["authEndPoint"]};
let getAppParams = (req: express.Request) : IAppParams => {return req["parameters"]};

router.post('/get_connected_app', (req: express.Request, res: express.Response) => {
	getAuthorizationEndpoint(req).getConnectedApp((err:any, connectedApp: auth_client.IConnectedApp) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(connectedApp);
	});
});

// login post - login UI will make this call when the "Login" button is pressed
router.post('/login', (req: express.Request, res: express.Response) => {
	console.log('hitting /login');
	let data:uiInt.ILoginParams = req.body;
	//console.log(JSON.stringify(data));
	// data.username, data.password, data.signUpUserForApp
	let signUpUserForApp = (data.signUpUserForApp ? true : false);
	let params = getAppParams(req);
	let response_type = params.response_type;
	getAuthorizationEndpoint(req).userLogin(response_type, data.username, data.password, signUpUserForApp, (err:any, ret: auth_client.ILoginResult) => {
		if (err)
			res.status(400).json(err);
		else {
			let user = ret.user;
			let redirectUrl = getAuthorizationEndpoint(req).redirect_uri;
			if (response_type === 'code') {	// response_type is auth code => put auth code in url query string
				redirectUrl += '?code=' + encodeURIComponent(ret.code);
			} else if (response_type === 'token') {	// response_type is 'token' => put access token in url fragment (#)
				let access = ret.access;
				redirectUrl += '#';
				let a:string[] = [];
				for (let fld in access) {
					if (access[fld] != null)
						a.push(encodeURIComponent(fld) + '=' + encodeURIComponent(access[fld].toString()));
				}
				redirectUrl += a.join('&');
			}
			if (params.state) redirectUrl += '&state=' + encodeURIComponent(params.state);	// add application state info
			console.log('redirecting browser to ' + redirectUrl);
			let result: uiInt.ILoginResult =  {redirect_url: redirectUrl};
			res.jsonp(result);
		}
	});
});

// start password reset process
// this send a PIN to user's email
router.post('/sspr', (req: express.Request, res: express.Response) => {
	let params:auth_client.IUsernameParams = req.body;
	getAuthorizationEndpoint(req).SSPR(params.username, (err:any, params: auth_client.IResetPasswordParams) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(params);
	});
});

// reset password
router.post('/reset_password', (req: express.Request, res: express.Response) => {
	let params:auth_client.IResetPasswordParams = req.body;
	getAuthorizationEndpoint(req).resetPassword(params.pin, (err:any) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp({});
	});
});

// lookup user in the system
router.post('/lookup_user', (req: express.Request, res: express.Response) => {
	let params:auth_client.IUsernameParams = req.body;
	getAuthorizationEndpoint(req).lookupUser(params.username, (err:any, user: auth_client.IAuthorizedUser) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(user);
	});
});

// create a new account and sign up for the client app
router.post('/sign_up_new_user', (req: express.Request, res: express.Response) => {
	let accountOptions:auth_client.IAccountOptions = req.body;
	getAuthorizationEndpoint(req).signUpNewUser(accountOptions, (err, user: auth_client.IAuthorizedUser) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(user);
	});
});

export {router as Router};