import {AuthorizationWorkflowParams} from 'oauth2';

// application parameters that get passed to the browser app
export interface IAppParams extends AuthorizationWorkflowParams {
    time_stamp: Date;
}

export interface IAppSettings {
	companyName: string
	,reCaptchaSiteKey: string
}