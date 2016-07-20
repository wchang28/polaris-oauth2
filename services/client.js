var $ = require('jquery-no-dom');
var $J = require('ajaxon')($);
var _ = require('lodash');

module.exports = function(authorizeBaseEndpoint, client_id, redirect_uri, client_secret) {
	this.client_id = client_id;
	this.redirect_uri = redirect_uri;
	this.client_secret = client_secret;
	
	var baseData = {
		client_id: client_id
		,redirect_uri: redirect_uri
		,client_secret: client_secret		
	};
	
	function getError(httpErr) {
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
	
	// done(err, connectedApp)
	this.getConnectedApp = function(done) {
		var url = authorizeBaseEndpoint + "/services/authorize/get_client"
		$J("POST", url, baseData, function(err, client) {
			if (typeof done === 'function') done(getError(err), client);
		}, null, false);
	};
	// done(err, ret)
	this.userLogin = function(response_type, username, password, signUpUser, done) {
		var data = _.assignIn({}, baseData, {'response_type' : response_type, 'username': username, 'password': password, 'signUpUser': signUpUser});
		var url = authorizeBaseEndpoint + "/services/authorize/login"
		$J("POST", url, data, function(err, ret) {
			if (typeof done === 'function') done(getError(err), ret);
		}, null, false);
	};
	// done(err, access)
	this.getAccessFromAuthCode = function(code, done) {
		var data = _.assignIn({}, baseData, {'code' : code});
		var url = authorizeBaseEndpoint + "/services/authorize/get_access_from_auth_code"
		$J("POST", url, data, function(err, access) {
			if (typeof done === 'function') done(getError(err), access);
		}, null, false);
	};
	// done(err, access)
	this.refreshToken = function(refresh_token, done) {
		var data = _.assignIn({}, baseData, {'refresh_token' : refresh_token});
		var url = authorizeBaseEndpoint + "/services/authorize/refresh_token"
		$J("POST", url, data, function(err, access) {
			if (typeof done === 'function') done(getError(err), access);
		}, null, false);
	};
	// done(err, data)
	this.SSPR = function(username, done) {
		var data = _.assignIn({}, baseData, {'username' : username});
		var url = authorizeBaseEndpoint + "/services/authorize/sspr"
		$J("POST", url, data, function(err, data) {
			if (typeof done === 'function') done(getError(err), data);
		}, null, false);
	};
	// done(err, data)
	this.resetPassword = function(pin, done) {
		var data = _.assignIn({}, baseData, {'pin' : pin});
		var url = authorizeBaseEndpoint + "/services/authorize/reset_password"
		$J("POST", url, data, function(err, data) {
			if (typeof done === 'function') done(getError(err), data);
		}, null, false);
	};
	// done(err, data)
	this.lookupUser = function(username, done) {
		var data = _.assignIn({}, baseData, {'username' : username});
		var url = authorizeBaseEndpoint + "/services/authorize/lookup_user"
		$J("POST", url, data, function(err, data) {
			if (typeof done === 'function') done(getError(err), data);
		}, null, false);		
	};
	// done (err, data)
	this.signUpNewUser = function(accountOptions, done) {
		var data = _.assignIn({}, baseData, {'accountOptions' : accountOptions});
		var url = authorizeBaseEndpoint + "/services/authorize/sign_up_new_user"
		$J("POST", url, data, function(err, data) {
			if (typeof done === 'function') done(getError(err), data);
		}, null, false);			
	};
};