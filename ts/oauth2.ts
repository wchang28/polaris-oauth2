export interface IClientAppSettings {
    client_id:string;
    redirect_uri?:string;
    client_secret?:string;
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