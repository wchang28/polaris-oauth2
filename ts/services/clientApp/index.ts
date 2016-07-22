import * as express from 'express';
import * as core from 'express-serve-static-core';
import {IConnectedApp, IAuthorizedUser, ILoginResult} from '../../authInterfaces';
import {ClientAppAuthEndPoint} from '../../clientAppAuthEndPoint';
import {IAppParams} from '../../appParams';
import * as oauth2 from 'oauth2';

let router = express.Router();

let getAuthorizationEndPoint = (req: express.Request) : ClientAppAuthEndPoint => {return req["authEndPoint"]};
let getAppParams = (req: express.Request) : IAppParams => {return req["parameters"]};

router.post('/get_connected_app', (req: express.Request, res: express.Response) => {
	getAuthorizationEndPoint(req).getConnectedApp((err:any, connectedApp: IConnectedApp) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(connectedApp);
	});
});

router.post('/verify_token', (req: express.Request, res: express.Response) => {
	let accessToken: oauth2.AccessToken = req.body;
	getAuthorizationEndPoint(req).verifyAccessToken(accessToken, (err:any, user:IAuthorizedUser) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(user);
	})
});

router.post('/lookup_user', (req: express.Request, res: express.Response) => {
	let data = req.body;
	// data.username
	let username = data.username;
	getAuthorizationEndPoint(req).lookupUser(username, (err, data) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// login post - login UI will make this call when the "Login" button is pressed
router.post('/login', (req: express.Request, res: express.Response) => {
	console.log('hitting /login');
	let data = req.body;
	//console.log(JSON.stringify(data));
	// data.username, data.password, data.signUpUserForApp
	let signUpUserForApp = (data.signUpUserForApp ? true : false);
	let params = getAppParams(req);
	let response_type = params.response_type;
	getAuthorizationEndPoint(req).userLogin(response_type, false, true, data.username, data.password, signUpUserForApp, (err:any, ret: ILoginResult) => {
		if (err)
			res.status(400).json(err);
		else {
			let user = ret.user;
			let redirectUrl = getAuthorizationEndPoint(req).redirect_uri;
			if (response_type === 'code') {	// response_type is auth code => put auth code in url query string
				redirectUrl += '?code=' + encodeURIComponent(ret.code);
			} else if (response_type === 'token') {	// response_type is 'token' => put access token in url fragment (#)
				let access = ret.access;
				redirectUrl += '#';
				let a:string[] = [];
				for (let fld in access)
					a.push(encodeURIComponent(fld) + '=' + encodeURIComponent(access[fld]));
				redirectUrl += a.join('&');
			}
			if (params.state) redirectUrl += '&state=' + encodeURIComponent(params.state);	// add application state info
			console.log('redirecting browser to ' + redirectUrl);
			//res.redirect(redirectUrl);
			res.jsonp({redirect_url: redirectUrl});
		}
	});
});

// start password reset process
// this send a PIN to user's email
router.post('/sspr', (req: express.Request, res: express.Response) => {
	let data = req.body;
	// data.username
	let username = data.username;
	getAuthorizationEndPoint(req).SSPR(username, (err, data) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// reset password
router.post('/reset_password', (req: express.Request, res: express.Response) => {
	let data = req.body;
	// data.pin
	let pin = data.pin;
	getAuthorizationEndPoint(req).resetPassword(pin, (err, data) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

// create a new account and sign up for the client app
router.post('/sign_up_new_user', (req: express.Request, res: express.Response) => {
	let data = req.body;
	// data.firstName
	let firstName = data.firstName;
	let lastName = data.lastName;
	let accountOptions = {
		firstName: data.firstName
		,lastName: data.lastName
		,username: data.username
		,password: data.password
		,companyName: data.companyName ? data.companyName : null
		,mobilePhone: data.mobilePhone
		,promotionalMaterial: data.promotionalMaterial
	}
	getAuthorizationEndPoint(req).signUpNewUser(accountOptions, (err, data) => {
		if (err)
			res.status(400).json(err);
		else
			res.jsonp(data);
	});
});

export {router as Router};