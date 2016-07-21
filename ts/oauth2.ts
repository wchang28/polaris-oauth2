export interface IClientAppSettings {
    client_id:string;
    redirect_uri?:string;   // weak verification for client
    client_secret?:string;  // strong verification for client
}

export interface AccessToken {
    token_type: string;
    access_token: string;
}

export interface Access extends AccessToken {
    refresh_token?: string;
    instance_url?: string;
}

export type TokenGrantType = "password" | "refresh_token" | "authorization_code";

export interface ITokenGrantParams extends IClientAppSettings {
    grant_type: TokenGrantType;
    code?: string;  // authorization_code workflow
    refresh_token?: string; // refresh_token 
    username?: string;  // password workflow
    password?: string;  // password workflow
}

export type AuthResponseType = "code" | "token";

export interface IAuthorizationWorkflowParams {
	response_type: AuthResponseType;
	client_id: string;
	redirect_uri: string;
	state?: string;    
}

export class TokenGrant {
    constructor(private jQuery:any, public tokenGrantUrl:string, public clientAppSettings:IClientAppSettings) {}
    getAccessTokenFromAuthCode (code:string, done:(err:any, access: Access) => void) : void {
        let params: ITokenGrantParams = {
            grant_type: 'authorization_code'
            ,code: code
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,redirect_uri: this.clientAppSettings.redirect_uri
        };
        this.jQuery.post(this.tokenGrantUrl, params)
        .done((data) => {
            let access:Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });		
    }
    getAccessTokenFromPassword(username:string, password:string, done:(err:any, access: Access) => void) : void {
        let params: ITokenGrantParams = {
            grant_type: 'password'
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,username: username
            ,password: password
        };
        this.jQuery.post(this.tokenGrantUrl, params)
        .done((data) => {
            let access: Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });			
    };
    refreshAccessToken(refresh_token:string, done:(err:any, access: Access) => void) : void {
        let params: ITokenGrantParams = {
            grant_type: 'refresh_token'
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,refresh_token: refresh_token
        };
        this.jQuery.post(this.tokenGrantUrl, params)
        .done((data) => {
            let access:Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });		
    };
} 