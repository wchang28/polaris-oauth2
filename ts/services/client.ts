import {getAJaxon} from 'ajaxon';
let $J = getAJaxon(require('jquery-no-dom'));
import * as _ from 'lodash';
import {IClientAppSettings} from '../oauth2';

export class Client {
	constructor (private authorizeBaseEndpoint:string, public appSettings:IClientAppSettings) {}
	get redirect_uri():string {return this.appSettings.redirect_uri;}
	getError(httpErr) {
		if (httpErr) {
			if (httpErr.responseJSON)
				return httpErr.responseJSON;
			else if (httpErr.responseText) {
				try {
					return JSON.parse(httpErr.responseText);
				} catch(e) {
					return httpErr.responseText;
				}
			} else
				return httpErr;
		} else
			return null;
	}
	// POST
	$P(path:string, data: any, done:(err:any, ret:any) => void) {
		$J('POST', this.authorizeBaseEndpoint + path, data, done, null, false);
	}
	getConnectedApp(done:(err:any, connectedApp:any) => void) {
		let data = this.appSettings;
		this.$P("/services/authorize/get_client", data, (err, client) => {
			if (typeof done === 'function') done(this.getError(err), client);
		});
	}
	userLogin(response_type:string, username:string, password:string, signUpUser:boolean, done:(err:any, ret:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'response_type' : response_type, 'username': username, 'password': password, 'signUpUser': signUpUser});
		this.$P("/services/authorize/login", data, (err, ret) => {
			if (typeof done === 'function') done(this.getError(err), ret);
		});
	};
	getAccessFromAuthCode(code:string, done:(err:any, access:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'code' : code});
		this.$P("/services/authorize/get_access_from_auth_code", data, (err, access) => {
			if (typeof done === 'function') done(this.getError(err), access);
		});
	};
	refreshToken(refresh_token:string, done:(err:any, access:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'refresh_token' : refresh_token});
		this.$P("/services/authorize/refresh_token", data, (err, access) => {
			if (typeof done === 'function') done(this.getError(err), access);
		});
	};
	SSPR(username:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'username' : username});
		this.$P("/services/authorize/sspr", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});
	};
	resetPassword(pin:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'pin' : pin});
		this.$P("/services/authorize/reset_password", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});
	};
	lookupUser(username:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'username' : username});
		let url = this.authorizeBaseEndpoint + "/services/authorize/lookup_user"
		this.$P("/services/authorize/lookup_user", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});		
	};
	signUpNewUser(accountOptions:any, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.appSettings, {'accountOptions' : accountOptions});
		this.$P("/services/authorize/sign_up_new_user", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});			
	};
}