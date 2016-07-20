import {IWebServerConfig} from 'express-web-server';

export interface IreCaptchaSettings {
	siteKey: string
	serverSecret: string
	url: string
}

export interface IAppConfig {
	webServerConfig?: IWebServerConfig;
	companyName: string;
	cipherSecret: string;
	authorizeBaseEndpoint: string;
	reCaptchaSettings: IreCaptchaSettings;
}