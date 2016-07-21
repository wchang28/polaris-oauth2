import {IWebServerConfig} from 'express-web-server';

export interface IAuthorizeEndpointOptions {
	baseUrl:string;
	rejectUnauthorized?:boolean
}

export interface IreCaptchaSettings {
	siteKey: string
	serverSecret: string
	url: string
}

export interface IAppConfig {
	webServerConfig?: IWebServerConfig;
	companyName: string;
	cipherSecret: string;
	authorizeEndpointOptions: IAuthorizeEndpointOptions;
	reCaptchaSettings: IreCaptchaSettings;
}