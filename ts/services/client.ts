import {getAJaxon} from 'ajaxon';
let $J = getAJaxon(require('jquery-no-dom'));
import * as _ from 'lodash';

export class Client {
	private baseData:any = null;
	constructor (private authorizeBaseEndpoint:string, public client_id:string, public redirect_uri:string, public client_secret:string) {
		this.baseData = {
			client_id: client_id
			,redirect_uri: redirect_uri
			,client_secret: client_secret		
		};		
	}
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
	$P(path:string, data: any, done:(err:any, ret:any) => void) {
		$J('POST', this.authorizeBaseEndpoint + path, data, done, null, false);
	}
	getConnectedApp(done:(err:any, connectedApp:any) => void) {
		let data = this.baseData;
		this.$P("/services/authorize/get_client", data, (err, client) => {
			if (typeof done === 'function') done(this.getError(err), client);
		});
	}
	userLogin(response_type:string, username:string, password:string, signUpUser:boolean, done:(err:any, ret:any) => void) {
		let data = _.assignIn({}, this.baseData, {'response_type' : response_type, 'username': username, 'password': password, 'signUpUser': signUpUser});
		this.$P("/services/authorize/login", data, (err, ret) => {
			if (typeof done === 'function') done(this.getError(err), ret);
		});
	};
	getAccessFromAuthCode(code:string, done:(err:any, access:any) => void) {
		let data = _.assignIn({}, this.baseData, {'code' : code});
		this.$P("/services/authorize/get_access_from_auth_code", data, (err, access) => {
			if (typeof done === 'function') done(this.getError(err), access);
		});
	};
	refreshToken(refresh_token:string, done:(err:any, access:any) => void) {
		let data = _.assignIn({}, this.baseData, {'refresh_token' : refresh_token});
		this.$P("/services/authorize/refresh_token", data, (err, access) => {
			if (typeof done === 'function') done(this.getError(err), access);
		});
	};
	SSPR(username:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.baseData, {'username' : username});
		this.$P("/services/authorize/sspr", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});
	};
	resetPassword(pin:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.baseData, {'pin' : pin});
		this.$P("/services/authorize/reset_password", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});
	};
	lookupUser(username:string, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.baseData, {'username' : username});
		let url = this.authorizeBaseEndpoint + "/services/authorize/lookup_user"
		this.$P("/services/authorize/lookup_user", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});		
	};
	signUpNewUser(accountOptions:any, done:(err:any, data:any) => void) {
		let data = _.assignIn({}, this.baseData, {'accountOptions' : accountOptions});
		this.$P("/services/authorize/sign_up_new_user", data, (err, data) => {
			if (typeof done === 'function') done(this.getError(err), data);
		});			
	};
}