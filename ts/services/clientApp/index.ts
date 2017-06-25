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
	getAuthorizationEndpoint(req).getConnectedApp()
	.then((connectedApp: auth_client.IConnectedApp) => {
		res.jsonp(connectedApp);
	}).catch((err: any) => {
		res.status(400).json(err);
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
	getAuthorizationEndpoint(req).userLogin(response_type, data.username, data.password, signUpUserForApp)
	.then((ret: auth_client.ILoginResult) => {
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
	}).catch((err: any) => {
		res.status(400).json(err);
	});
});

// start password reset process
// this send a PIN to user's email
router.post('/sspr', (req: express.Request, res: express.Response) => {
	let params:auth_client.IUsernameParams = req.body;
	getAuthorizationEndpoint(req).SSPR(params.username)
	.then((params: auth_client.IResetPasswordParams) => {
		res.jsonp(params);
	}).catch((err: any) => {
		res.status(400).json(err);
	});
});

// reset password
router.post('/reset_password', (req: express.Request, res: express.Response) => {
	let params:auth_client.IResetPasswordParams = req.body;
	getAuthorizationEndpoint(req).resetPassword(params.pin)
	.then((ret: any) => {
		res.jsonp(ret);
	}).catch((err:any) => {
		res.status(400).json(err);
	});
});

// lookup user in the system
router.post('/lookup_user', (req: express.Request, res: express.Response) => {
	let params:auth_client.IUsernameParams = req.body;
	getAuthorizationEndpoint(req).lookupUser(params.username)
	.then((user: auth_client.IAuthorizedUser) => {
		res.jsonp(user);
	}).catch((err: any) => {
		res.status(400).json(err);
	});
});

// create a new account and sign up for the client app
router.post('/sign_up_new_user', (req: express.Request, res: express.Response) => {
	let accountOptions:auth_client.IAccountOptions = req.body;
	getAuthorizationEndpoint(req).signUpNewUser(accountOptions)
	.then((user: auth_client.IAuthorizedUser) => {
		res.jsonp(user);
	}).catch((err: any) => {
		res.status(400).json(err);
	});
});

export {router as Router};