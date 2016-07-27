import {IWebServerConfig} from 'express-web-server';
import * as auth_client from 'polaris-auth-client';

export interface IreCaptchaSettings {
	siteKey: string
	serverSecret: string
	siteVerifyUrl: string
}

export interface IAppConfig {
	webServerConfig?: IWebServerConfig;
	companyName: string;
	cipherSecret: string;
	authorizeEndpointOptions: auth_client.IAuthorizeEndpointOptions;
	reCaptchaSettings: IreCaptchaSettings;
}