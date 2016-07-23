import {IWebServerConfig} from 'express-web-server';
import {IAuthorizeEndpointOptions} from './authInterfaces';


export interface IreCaptchaSettings {
	siteKey: string
	serverSecret: string
	siteVerifyUrl: string
}

export interface IAppConfig {
	webServerConfig?: IWebServerConfig;
	companyName: string;
	cipherSecret: string;
	authorizeEndpointOptions: IAuthorizeEndpointOptions;
	reCaptchaSettings: IreCaptchaSettings;
}