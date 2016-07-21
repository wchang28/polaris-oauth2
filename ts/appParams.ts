import {IAuthorizationWorkflowParams} from './oauth2';

// application parameters that get passed to the browser app
export interface IAppParams extends IAuthorizationWorkflowParams {
    time_stamp: Date;
}

export interface IAppSettings {
	companyName: string
	,reCaptchaSiteKey: string
}